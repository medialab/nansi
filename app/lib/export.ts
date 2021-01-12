import Graph from 'graphology';
import gexf from 'graphology-gexf/browser';

import {saveText, saveCanvas} from './save';

export type ExportFormat = 'gexf' | 'json' | 'png';

interface BaseExportOptions {
  name: string;
  format: ExportFormat;
}

interface GEXFExportOptions extends BaseExportOptions {
  format: 'gexf';
}

interface JSONExportOptions extends BaseExportOptions {
  format: 'json';
  minify?: boolean;
}

interface PNGExportOptions extends BaseExportOptions {
  format: 'png';
  canvas: HTMLCanvasElement;
}

type ExportOptions = GEXFExportOptions | JSONExportOptions | PNGExportOptions;

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

  if (options.format === 'png') {
    saveCanvas(options.name, options.canvas);
    return;
  }

  throw new Error('nansi/app/lib/export: unknown export format!');
}
