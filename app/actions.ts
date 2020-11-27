import Graph from 'graphology-types';
import {useSetRecoilState} from 'recoil';

import straighten from '../lib/straighten';

import * as atoms from './atoms';

export function useSetNewGraph() {
  const setView = useSetRecoilState(atoms.view);
  const setGraph = useSetRecoilState(atoms.graph);

  return (graph: Graph) => {
    setView('basemap');

    // Graph processing
    straighten(graph);

    setGraph(graph);
  };
}
