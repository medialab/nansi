import {importGraph} from '../lib/import';

const ctx: Worker = self as any;

ctx.onmessage = event => {
  importGraph(event.data, (err, {graph, model}) => {
    if (err) return ctx.postMessage({error: err});

    return ctx.postMessage({result: {serializedGraph: graph, model}});
  });
};
