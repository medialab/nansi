import Graph from 'graphology';
import gexf from 'graphology-gexf/browser';

import straighten from '../../lib/straighten';

type ImportOptions = {
  type: 'example' | 'file' | 'text';
  format?: 'gexf';
  name?: string;
  text?: string;
};

type ImportCallback = (err: Error | null, graph?: Graph) => void;

function importExample(options: ImportOptions, callback: ImportCallback): void {
  const url = `./resources/${options.name}.gexf`;

  fetch(url)
    .then(response => response.text())
    .then(text => {
      const graph = gexf.parse(Graph, text);

      callback(null, graph);
    });
}

function importText(options: ImportOptions, callback: ImportCallback): void {
  if (options.format === 'gexf')
    return callback(null, gexf.parse(Graph, options.text));

  return callback(new Error('nansi/app/lib/import: unknown text format!'));
}

const importFunctions = {
  example: importExample,
  text: importText
};

export function importGraph(
  options: ImportOptions,
  callback: ImportCallback
): void {
  let fn = importFunctions[options.type];

  if (!fn) throw new Error('nansi/app/lib/import: unknown import type!');

  fn(options, (err, graph: Graph) => {
    if (err) return callback(err);

    // Common graph processing
    straighten(graph);

    return callback(null, graph);
  });
}
