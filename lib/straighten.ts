import Graph from 'graphology-types';
import seedrandom from 'seedrandom';
import {createRandomFloat} from 'pandemonium/random-float';

const RNG = seedrandom('nansi');
const randomFloat = createRandomFloat(RNG);

/**
 * Helper used to assess whether the given value is truly a number.
 */
function isNumber(value): boolean {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Function used to "straighten" a graph by adding missing positions,
 * for instance.
 */
type GraphModelAttribute = {
  name: string;
};

type GraphModel = {
  nodes: {[key: string]: GraphModelAttribute};
};

export default function straighten(graph: Graph): GraphModel {
  let minX: number = Infinity;
  let maxX: number = -Infinity;
  let minY: number = Infinity;
  let maxY: number = -Infinity;

  let missingPositions = false;

  const model: GraphModel = {
    nodes: {}
  };

  // Computing extents & model
  graph.forEachNode((node, attr) => {
    if (isNumber(attr.x)) {
      if (attr.x < minX) minX = attr.x;
      else if (attr.x > maxX) maxX = attr.x;
    } else {
      missingPositions = true;
    }

    if (isNumber(attr.y)) {
      if (attr.y < minY) minY = attr.y;
      else if (attr.y > maxY) maxY = attr.y;
    } else {
      missingPositions = true;
    }

    // Attributes inference
    for (const k in attr) {
      if (!(k in model.nodes)) {
        model.nodes[k] = {name: k};
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

  return model;
}
