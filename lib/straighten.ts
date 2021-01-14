import Graph from 'graphology-types';
import seedrandom from 'seedrandom';
import {createRandomFloat} from 'pandemonium/random-float';
import MultiSet from 'mnemonist/multi-set';
import louvain from 'graphology-communities-louvain';
import inferType from 'graphology-utils/infer-type';
import betweenness from 'graphology-metrics/centrality/betweenness';

import {generatePalette} from './palettes';

const RNG = seedrandom('nansi');
const randomFloat = createRandomFloat(RNG);

/**
 * Constants.
 */
const WELL_KNOWN_NODE_ATTRIBUTES = new Set([
  'label',
  'size',
  'x',
  'y',
  'color'
]);
const CATEGORY_CUTOFF_RATIO = 0.6;
const CATEGORY_TOP_VALUES = 15;

/**
 * Helper used to assess whether the given value is truly a number.
 */
function isNumber(value): boolean {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Types used to represent the inferred model.
 */
export type GraphModelAttributeKind = 'own' | 'wellKnown' | 'computed';
export type GraphModelAttributeType =
  | 'category'
  | 'boolean'
  | 'number'
  | 'key'
  | 'unknown'
  | 'constant';

class GraphModelBaseAttribute {
  name: string;
  kind: GraphModelAttributeKind;
  type: GraphModelAttributeType;
  count: number;

  constructor(name: string, kind: GraphModelAttributeKind, count = 0) {
    this.name = name;
    this.kind = kind;
    this.count = count;
  }

  // noop
  finalize() {}
}

class GraphModelCategoryAttribute extends GraphModelBaseAttribute {
  type: 'category' = 'category';
  frequencies: MultiSet<string> = new MultiSet();
  cardinality: number = 0;
  top?: Array<[string, number]>;
  palette?: {[key: string]: string};

  degradeToKeyAttribute() {
    return new GraphModelKeyAttribute(this.name, this.kind, this.count);
  }

  isConstant() {
    return this.frequencies.dimension === 1;
  }

  degradeToConstant() {
    const replacement = new GraphModelConstantAttribute(
      this.name,
      this.kind,
      this.count
    );

    replacement.value = this.frequencies.top(1)[0][0];

    return replacement;
  }

  finalize() {
    this.cardinality = this.frequencies.dimension;
    this.top = this.frequencies.top(CATEGORY_TOP_VALUES);

    const palette = generatePalette(this.name, this.top.length);

    this.palette = {};

    palette.forEach((color, i) => {
      this.palette[this.top[i][0]] = color;
    });

    delete this.frequencies;
  }
}

// class GraphModelBooleanAttribute extends GraphModelBaseAttribute {
//   type: 'boolean' = 'boolean';
//   frequencies: [number, number] = [0, 0];
//   cardinality: number = 0;
// }

class GraphModelNumberAttribute extends GraphModelBaseAttribute {
  type: 'number' = 'number';
  max: number = -Infinity;
  min: number = Infinity;

  isConstant() {
    return this.min === this.max;
  }

  degradeToConstant() {
    const replacement = new GraphModelConstantAttribute(
      this.name,
      this.kind,
      this.count
    );

    replacement.value = this.min;

    return replacement;
  }
}

class GraphModelKeyAttribute extends GraphModelBaseAttribute {
  type: 'key' = 'key';
}

class GraphModelUnknownAttribute extends GraphModelBaseAttribute {
  type: 'unknown' = 'unknown';
}

class GraphModelConstantAttribute extends GraphModelBaseAttribute {
  type: 'constant' = 'constant';
  value: string | number;
}

const attributeClasses = {
  unknown: GraphModelUnknownAttribute,
  category: GraphModelCategoryAttribute,
  key: GraphModelKeyAttribute,
  number: GraphModelNumberAttribute
};

export type GraphModelAttribute =
  | GraphModelBaseAttribute
  | GraphModelCategoryAttribute
  | GraphModelNumberAttribute
  | GraphModelKeyAttribute
  | GraphModelConstantAttribute
  | GraphModelUnknownAttribute;

export type GraphModelDeclaration = {[key: string]: GraphModelAttribute};

type ItemType = 'node' | 'edge';

class GraphModelAttributes {
  attributes: GraphModelDeclaration = {};
  type: ItemType;
  cutoff: number;

  constructor(type: ItemType, cutoff: number) {
    this.type = type;
    this.cutoff = cutoff;
  }

  add(name, value) {
    let probableType: GraphModelAttributeType = 'unknown';

    if (typeof value === 'number') probableType = 'number';
    else if (typeof value === 'string') probableType = 'category';

    if (name === 'color') probableType = 'key';
    else if (name === 'label') probableType = 'key';
    else if (name === 'nansi-louvain') probableType = 'category';

    let attr = this.attributes[name];

    if (!attr) {
      let kind: GraphModelAttributeKind = 'own';

      if (this.type === 'node' && WELL_KNOWN_NODE_ATTRIBUTES.has(name))
        kind = 'wellKnown';

      if (name.startsWith('nansi-')) kind = 'computed';

      attr = new attributeClasses[probableType](name, kind);
      this.attributes[name] = attr;
    }

    attr.count++;

    if (attr instanceof GraphModelNumberAttribute) {
      if (value > attr.max) attr.max = value;
      if (value < attr.min) attr.min = value;
    } else if (attr instanceof GraphModelCategoryAttribute) {
      attr.frequencies.add(value);

      // Too much unique values to consider it a category
      if (attr.frequencies.dimension > this.cutoff) {
        this.attributes[name] = attr.degradeToKeyAttribute();
      }
    }
  }

  finalize(): GraphModelDeclaration {
    for (const name in this.attributes) {
      const attr = this.attributes[name];

      if (
        (attr instanceof GraphModelCategoryAttribute ||
          attr instanceof GraphModelNumberAttribute) &&
        attr.isConstant()
      ) {
        this.attributes[name] = attr.degradeToConstant();
      } else {
        attr.finalize();
      }
    }

    return this.attributes;
  }
}

export type GraphModelExtents = {
  nodeSize: {
    min: number;
    max: number;
  };
};

export type GraphModel = {
  nodes: GraphModelDeclaration;
  extents?: GraphModelExtents;
};

/**
 * Function used to "straighten" a graph by adding missing positions,
 * for instance.
 */
export default function straighten(graph: Graph): GraphModel {
  let minX: number = Infinity;
  let maxX: number = -Infinity;
  let minY: number = Infinity;
  let maxY: number = -Infinity;
  let minSize: number = Infinity;
  let maxSize: number = -Infinity;

  let missingPositions = false;

  const nodeAttributes = new GraphModelAttributes(
    'node',
    graph.order * CATEGORY_CUTOFF_RATIO
  );

  // Computing some metrics
  if (inferType(graph) !== 'mixed')
    louvain.assign(graph, {attributes: {community: 'nansi-louvain'}, rng: RNG});

  betweenness.assign(graph, {attributes: {centrality: 'nansi-betweenness'}});

  // Computing extents & model
  graph.forEachNode((node, attr) => {
    if (isNumber(attr.x)) {
      if (attr.x < minX) minX = attr.x;
      if (attr.x > maxX) maxX = attr.x;
    } else {
      missingPositions = true;
    }

    if (isNumber(attr.y)) {
      if (attr.y < minY) minY = attr.y;
      if (attr.y > maxY) maxY = attr.y;
    } else {
      missingPositions = true;
    }

    if (isNumber(attr.size)) {
      if (attr.size < minSize) minSize = attr.size;
      if (attr.size > maxSize) maxSize = attr.size;
    }

    attr['nansi-degree'] = graph.degree(node);

    if (graph.type !== 'undirected') {
      attr['nansi-indegree'] = graph.inDegree(node);
      attr['nansi-outdegree'] = graph.outDegree(node);
    }

    // Attributes inference
    for (const k in attr) {
      const v = attr[k];
      nodeAttributes.add(k, v);
    }
  });

  // Create random functions
  let randomX = RNG;
  let randomY = RNG;

  if (graph.order > 1 && minX !== Infinity) {
    randomX = randomFloat.bind(null, minX, maxY);
    randomY = randomFloat.bind(null, minY, maxY);
  }

  // Giving random positions to nodes that miss one
  if (missingPositions)
    graph.updateEachNodeAttributes((node, attr) => {
      if (!isNumber(attr.x)) attr.x = randomX();

      if (!isNumber(attr.y)) attr.y = randomY();

      return attr;
    });

  const model: GraphModel = {
    nodes: nodeAttributes.finalize(),
    extents: {
      nodeSize: {
        min: minSize === Infinity ? 1 : minSize,
        max: maxSize === -Infinity ? 1 : maxSize
      }
    }
  };

  return model;
}
