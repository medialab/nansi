import Graph from 'graphology';
import gexf from 'graphology-gexf';
import graphml from 'graphology-graphml';

import straighten, {GraphModel} from '../../lib/straighten';

export type ImportFormat = 'gexf' | 'graphml' | 'json';

export type ImportOptions = {
  type: 'example' | 'file' | 'text';
  format?: ImportFormat;
  name?: string;
  text?: string;
  file?: File;
};

type ImportSubCallback = (err: Error | null, graph?: Graph) => void;

export type ImportCallback = (
  err: Error | null,
  result?: {graph: Graph; model: GraphModel}
) => void;

function importExample(
  options: ImportOptions,
  callback: ImportSubCallback
): void {
  const url = `${NANSI_BASE_URL}resources/${options.name}.gexf`;

  fetch(url)
    .then(response => response.text())
    .then(text => {
      const graph = gexf.parse(Graph, text);

      callback(null, graph);
    });
}

function importText(options: ImportOptions, callback: ImportSubCallback): void {
  if (options.format === 'gexf')
    return callback(null, gexf.parse(Graph, options.text));

  if (options.format === 'graphml')
    return callback(null, graphml.parse(Graph, options.text));

  if (options.format === 'json')
    return callback(null, Graph.from(JSON.parse(options.text)));

  return callback(new Error('nansi/app/lib/import: unknown text format!'));
}

function importFile(options: ImportOptions, callback: ImportSubCallback): void {
  const reader = new FileReader();

  reader.onload = e => {
    const text = e.target.result as string;

    const name = options.file.name;

    let format: ImportFormat | null = null;

    if (name.endsWith('.gexf')) format = 'gexf';
    else if (name.endsWith('.graphml')) format = 'graphml';
    else if (name.endsWith('.json')) format = 'json';

    if (!format) return callback(new Error('unknown format'));

    return importText({type: 'text', text, format}, callback);
  };

  reader.readAsText(options.file);
}

const importFunctions = {
  example: importExample,
  text: importText,
  file: importFile
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
    const model = straighten(graph);

    return callback(null, {graph, model});
  });
}
