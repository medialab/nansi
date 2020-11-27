import Graph from 'graphology-types';
import {useSetRecoilState} from 'recoil';

import straighten from '../lib/straighten';

import * as atoms from './atoms';

export function useSetNewGraph() {
  const setView = useSetRecoilState(atoms.view);
  const setGraph = useSetRecoilState(atoms.graph);
  const setModal = useSetRecoilState(atoms.modal);

  return (graph: Graph) => {
    // Graph processing
    straighten(graph);

    setView('basemap');
    setModal(null);
    setGraph(graph);
  };
}

export function useOpenModal() {
  const setModal = useSetRecoilState(atoms.modal);

  return setModal;
}
