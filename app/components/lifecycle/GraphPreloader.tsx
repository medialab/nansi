import {useEffect} from 'react';

import {getGraphInQuery} from '../../lib/location';
import {useIsPreloadingGraph, useSetNewGraph} from '../../hooks';
import workerPool from '../../workers/pool';

export default function GraphPreloader() {
  const [_, setIsPreloadingGraph] = useIsPreloadingGraph();
  const setGraph = useSetNewGraph();

  useEffect(() => {
    const graphUrl = getGraphInQuery();

    // Do we need to preload the graph from an url?
    if (!graphUrl) {
      return;
    }

    setIsPreloadingGraph(true);

    workerPool.import({type: 'url', url: graphUrl}, (err, {graph, model}) => {
      setIsPreloadingGraph(false);
      setGraph(graph, model);
    });
  }, []);

  return null;
}
