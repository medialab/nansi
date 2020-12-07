import Graph from 'graphology';
import gexf from 'graphology-gexf/browser';

import {saveText} from './save';

export type ExportFormat = 'gexf' | 'json';

type ExportOptions = {
  name: string;
  format: ExportFormat;
};

export function exportGraph(graph: Graph, options: ExportOptions): void {
  if (options.format === 'gexf') {
    saveText(options.name, gexf.write(graph), 'application/xml');
    return;
  }

  if (options.format === 'json') {
    saveText(options.name, JSON.stringify(graph, null, 2), 'application/json');
    return;
  }

  throw new Error('nansi/app/lib/export: unknown export format!');
}
