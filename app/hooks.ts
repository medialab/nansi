import Graph from 'graphology-types';
import {GraphModel} from '../lib/straighten';
import {useSetRecoilState, useRecoilValue} from 'recoil';

import * as atoms from './atoms';

export function useGraph() {
  const graph = useRecoilValue(atoms.graph);

  return graph;
}

export function useModel() {
  const model = useRecoilValue(atoms.model);

  return model;
}

export function useSetNewGraph() {
  const setView = useSetRecoilState(atoms.view);
  const setGraph = useSetRecoilState(atoms.graph);
  const setModal = useSetRecoilState(atoms.modal);
  const setModel = useSetRecoilState(atoms.model);

  return (graph: Graph, model: GraphModel) => {
    setView('basemap');
    setModal(null);
    setGraph(graph);
    setModel(model);
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
