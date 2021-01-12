import Graph from 'graphology';
import gexf from 'graphology-gexf/browser';

import {saveText} from './save';

export type ExportFormat = 'gexf' | 'json';

interface BaseExportOptions {
  name: string;
  format: ExportFormat;
}

interface GexfExportOptions extends BaseExportOptions {
  format: 'gexf';
}

interface JsonExportOptions extends BaseExportOptions {
  format: 'json';
  minify?: boolean;
}

type ExportOptions = GexfExportOptions | JsonExportOptions;

export function exportGraph(graph: Graph, options: ExportOptions): void {
  if (options.format === 'gexf') {
    saveText(options.name, gexf.write(graph), 'application/xml');
    return;
  }

  if (options.format === 'json') {
    saveText(
      options.name,
      JSON.stringify(graph, null, options.minify ? 0 : 2),
      'application/json'
    );
    return;
  }

  throw new Error('nansi/app/lib/export: unknown export format!');
}
