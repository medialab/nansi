import Graph from 'graphology-types';

export function exportLayout(graph: Graph): Float64Array {
  const pos = new Float64Array(graph.order * 2);

  let i = 0;

  graph.forEachNode((node, attr) => {
    pos[i++] = attr.x;
    pos[i++] = attr.y;
  });

  return pos;
}
