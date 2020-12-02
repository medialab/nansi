import Graph from 'graphology-types';
import seedrandom from 'seedrandom';
import {createRandomFloat} from 'pandemonium/random-float';
import MultiSet from 'mnemonist/multi-set';
import louvain from 'graphology-communities-louvain';
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
export type GraphModelAttributeType = 'category' | 'number' | 'key' | 'unknown';

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
  frequencies?: MultiSet<string> = new MultiSet();
  cardinality?: number = 0;
  top?: Array<[string, number]>;
  palette?: {[key: string]: string};

  degradeToKeyAttribute() {
    return new GraphModelKeyAttribute(this.name, this.kind, this.count);
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

class GraphModelNumberAttribute extends GraphModelBaseAttribute {
  type: 'number' = 'number';
  max: number = -Infinity;
  min: number = Infinity;
}

class GraphModelKeyAttribute extends GraphModelBaseAttribute {
  type: 'key' = 'key';
}

class GraphModelUnknownAttribute extends GraphModelBaseAttribute {
  type: 'unknown' = 'unknown';
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
  | GraphModelUnknownAttribute;

export type GraphModelDeclaration = {[key: string]: GraphModelAttribute};

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

  const model: GraphModel = {
    nodes: {}
  };

  // Computing some metrics
  if (!graph.multi)
    louvain.assign(graph, {attributes: {community: 'nansi-louvain'}, rng: RNG});

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

    // Attributes inference
    for (const k in attr) {
      const v = attr[k];

      let probableType: GraphModelAttributeType = 'unknown';

      if (typeof v === 'number') probableType = 'number';
      else if (typeof v === 'string') probableType = 'category';

      if (k === 'color') probableType = 'key';
      else if (k === 'label') probableType = 'key';
      else if (k === 'nansi-louvain') probableType = 'category';

      let currentAttribute = model.nodes[k];

      if (!currentAttribute) {
        let kind: GraphModelAttributeKind = 'own';

        if (WELL_KNOWN_NODE_ATTRIBUTES.has(k)) kind = 'wellKnown';

        if (k.startsWith('nansi-')) kind = 'computed';

        currentAttribute = new attributeClasses[probableType](k, kind);
        model.nodes[k] = currentAttribute;
      }

      currentAttribute.count++;

      // TODO: handle conflicts
      if (currentAttribute instanceof GraphModelNumberAttribute) {
        if (v > currentAttribute.max) currentAttribute.max = v;
        if (v < currentAttribute.min) currentAttribute.min = v;
      } else if (currentAttribute instanceof GraphModelCategoryAttribute) {
        currentAttribute.frequencies.add(v);

        // Too much unique values to consider it a category
        if (
          currentAttribute.frequencies.dimension >
          graph.order * CATEGORY_CUTOFF_RATIO
        ) {
          model.nodes[k] = currentAttribute.degradeToKeyAttribute();
        }
      }
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

  for (const k in model.nodes) model.nodes[k].finalize();

  model.extents = {
    nodeSize: {
      min: minSize === Infinity ? 1 : minSize,
      max: maxSize === -Infinity ? 1 : maxSize
    }
  };

  return model;
}
