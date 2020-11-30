import Graph from 'graphology';
import gexf from 'graphology-gexf/browser';

import {saveText} from './save';

type ExportOptions = {
  name: string;
  format: 'gexf';
};

export function exportGraph(graph: Graph, options: ExportOptions): void {
  if (options.format === 'gexf') {
    saveText('graph.gexf', gexf.write(graph), 'application/xml');
    return;
  }

  throw new Error('nansi/app/lib/export: unknown export format!');
}
