import Graph from 'graphology-types';
import {useSetRecoilState, useRecoilValue} from 'recoil';

import * as atoms from './atoms';

export function useGraph() {
  const graph = useRecoilValue(atoms.graph);

  return graph;
}

export function useSetNewGraph() {
  const setView = useSetRecoilState(atoms.view);
  const setGraph = useSetRecoilState(atoms.graph);
  const setModal = useSetRecoilState(atoms.modal);

  return (graph: Graph) => {
    setView('basemap');
    setModal(null);
    setGraph(graph);
  };
}

export function useOpenModal() {
  const setModal = useSetRecoilState(atoms.modal);

  return setModal;
}

export function useCloseModal() {
  const setModal = useSetRecoilState(atoms.modal);

  return () => setModal(null);
}
