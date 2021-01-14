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

interface BaseSerializedGraphModelAttribute {
  name: string;
  kind: GraphModelAttributeKind;
  type: GraphModelAttributeType;
  count: number;
}

class BaseGraphModelAttribute {
  name: string;
  kind: GraphModelAttributeKind;
  type: GraphModelAttributeType;
  count: number;

  constructor(name: string, kind: GraphModelAttributeKind, count = 0) {
    this.name = name;
    this.kind = kind;
    this.count = count;
  }

  serialize(): BaseSerializedGraphModelAttribute {
    return {
      name: this.name,
      kind: this.kind,
      type: this.type,
      count: this.count
    };
  }

  // noops
  add(_: any) {
    this.count++;
  }
}

interface SerializedGraphModelCategoryAttribute
  extends BaseSerializedGraphModelAttribute {
  cardinality: number;
  top: Array<[string, number]>;
  palette: {[key: string]: string};
}

class GraphModelCategoryAttribute extends BaseGraphModelAttribute {
  type: 'category' = 'category';
  frequencies: MultiSet<string> = new MultiSet();

  add(value: string) {
    this.frequencies.add(value);
    this.count++;
  }

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

  serialize(): SerializedGraphModelCategoryAttribute {
    const serialized = super.serialize.call(this);

    serialized.cardinality = this.frequencies.dimension;
    serialized.top = this.frequencies.top(CATEGORY_TOP_VALUES);

    const palette = generatePalette(this.name, serialized.top.length);

    serialized.palette = {};

    palette.forEach((color, i) => {
      serialized.palette[serialized.top[i][0]] = color;
    });

    return serialized;
  }
}

interface SerializedGraphModelBooleanAttribute
  extends BaseSerializedGraphModelAttribute {
  cardinality: number;
  top: Array<[boolean, number]>;
  palette: {[key: string]: string};
}

class GraphModelBooleanAttribute extends BaseGraphModelAttribute {
  type: 'boolean' = 'boolean';
  frequencies: [number, number] = [0, 0];

  add(value: boolean) {
    this.frequencies[+value] += 1;
    this.count++;
  }

  isConstant() {
    return !this.frequencies[0] || !this.frequencies[1];
  }

  degradeToConstant() {
    const replacement = new GraphModelConstantAttribute(
      this.name,
      this.kind,
      this.count
    );

    replacement.value = this.frequencies[0] ? false : true;

    return replacement;
  }

  serialize(): SerializedGraphModelBooleanAttribute {
    const serialized = super.serialize.call(this);

    serialized.cardinality = 2;
    serialized.top =
      this.frequencies[0] > this.frequencies[1]
        ? [
            [false, this.frequencies[0]],
            [true, this.frequencies[1]]
          ]
        : [
            [true, this.frequencies[1]],
            [false, this.frequencies[0]]
          ];

    const palette = generatePalette(this.name, 2);

    serialized.palette = {};

    palette.forEach((color, i) => {
      serialized.palette[serialized.top['' + i][0]] = color;
    });

    return serialized;
  }
}

interface SerializedGraphModelNumberAttribute
  extends BaseSerializedGraphModelAttribute {
  min: number;
  max: number;
  integer: boolean;
}

class GraphModelNumberAttribute extends BaseGraphModelAttribute {
  type: 'number' = 'number';
  max: number = -Infinity;
  min: number = Infinity;
  integer: boolean = true;

  add(value: number) {
    if (value > this.max) this.max = value;
    if (value < this.min) this.min = value;

    if (this.integer && !Number.isInteger(value)) {
      this.integer = false;
    }

    this.count++;
  }

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

  serialize(): SerializedGraphModelNumberAttribute {
    const serialized = super.serialize.call(this);

    serialized.min = this.min;
    serialized.max = this.max;

    serialized.integer = this.integer;

    return serialized;
  }
}

class GraphModelKeyAttribute extends BaseGraphModelAttribute {
  type: 'key' = 'key';
}

class GraphModelUnknownAttribute extends BaseGraphModelAttribute {
  type: 'unknown' = 'unknown';
}

interface SerializedGraphModelConstantAttribute
  extends BaseSerializedGraphModelAttribute {
  value: string | number | boolean;
}

class GraphModelConstantAttribute extends BaseGraphModelAttribute {
  type: 'constant' = 'constant';
  value: string | number | boolean;

  serialize(): SerializedGraphModelConstantAttribute {
    const serialized = super.serialize.call(this);

    serialized.value = this.value;

    return serialized;
  }
}

const attributeClasses = {
  unknown: GraphModelUnknownAttribute,
  category: GraphModelCategoryAttribute,
  key: GraphModelKeyAttribute,
  number: GraphModelNumberAttribute,
  boolean: GraphModelBooleanAttribute
};

type GraphModelAttribute =
  | GraphModelCategoryAttribute
  | GraphModelBooleanAttribute
  | GraphModelNumberAttribute
  | GraphModelKeyAttribute
  | GraphModelConstantAttribute
  | GraphModelUnknownAttribute;

export type SerializedGraphModelAttribute =
  | BaseSerializedGraphModelAttribute
  | SerializedGraphModelConstantAttribute
  | SerializedGraphModelCategoryAttribute
  | SerializedGraphModelNumberAttribute
  | SerializedGraphModelBooleanAttribute;

type GraphItemType = 'node' | 'edge';

class GraphModelAttributes {
  attributes: {[key: string]: GraphModelAttribute} = {};
  type: GraphItemType;
  cutoff: number;

  constructor(type: GraphItemType, cutoff: number) {
    this.type = type;
    this.cutoff = cutoff;
  }

  add(name, value) {
    let probableType: GraphModelAttributeType = 'unknown';

    // Inference from variable type
    if (typeof value === 'number') probableType = 'number';
    else if (typeof value === 'string') probableType = 'category';
    else if (typeof value === 'boolean') probableType = 'boolean';

    // Inference from variable name
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

    attr.add(value);

    if (attr instanceof GraphModelCategoryAttribute) {
      // Too much unique values to still consider it a category
      if (attr.frequencies.dimension > this.cutoff) {
        this.attributes[name] = attr.degradeToKeyAttribute();
      }
    }
  }

  serialize(): SerializedGraphModelAttributes {
    const serialized = {};

    for (const name in this.attributes) {
      const attr = this.attributes[name];

      if (
        (attr instanceof GraphModelCategoryAttribute ||
          attr instanceof GraphModelNumberAttribute) &&
        attr.isConstant()
      ) {
        this.attributes[name] = attr.degradeToConstant();
      }

      serialized[name] = this.attributes[name].serialize();
    }

    return serialized;
  }
}

export type GraphModelExtents = {
  nodeSize: {
    min: number;
    max: number;
  };
};

export type SerializedGraphModelAttributes = {
  [key: string]: SerializedGraphModelAttribute;
};

export type GraphModel = {
  nodes: SerializedGraphModelAttributes;
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
    nodes: nodeAttributes.serialize(),
    extents: {
      nodeSize: {
        min: minSize === Infinity ? 1 : minSize,
        max: maxSize === -Infinity ? 1 : maxSize
      }
    }
  };

  return model;
}
