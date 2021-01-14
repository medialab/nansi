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

export function applyLayout(graph: Graph, layout: Float64Array) {
  if (layout.length !== graph.order * 2)
    throw new Error(
      'nansi/lib/utils/applyLayout: layout length is not consistent with graph order!'
    );

  let i = 0;

  graph.updateEachNodeAttributes(
    (node, attr) => {
      attr.x = layout[i++];
      attr.y = layout[i++];

      return attr;
    },
    {attributes: ['x', 'y']}
  );
}

export function isNumber(value): boolean {
  return typeof value === 'number' && !isNaN(value);
}
