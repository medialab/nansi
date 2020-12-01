import Graph from 'graphology';
import {ImportOptions, ImportCallback} from '../lib/import';
import ImportWorker from './import.worker';

class WorkerPool {
  import(options: ImportOptions, callback: ImportCallback) {
    const worker = new ImportWorker();

    worker.onmessage = event => {
      worker.terminate();

      const {error, result} = event.data;

      if (error) return callback(error);

      return callback(null, {
        graph: Graph.from(result.serializedGraph),
        model: result.model
      });
    };

    worker.postMessage(options);
  }
}

const pool = new WorkerPool();

export default pool;
