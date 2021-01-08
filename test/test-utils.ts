import Graph from 'graphology';
import gexf from 'graphology-gexf';
import fs from 'fs';
import {join} from 'path';

import {inspect} from 'util';

inspect.defaultOptions.depth = 5;

export function loadGexfResource(name) {
  const text = fs.readFileSync(
    join(__dirname, '..', 'resources', `${name}.gexf`),
    'utf-8'
  );

  return gexf.parse(Graph, text);
}
