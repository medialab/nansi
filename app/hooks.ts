import {useRef, useEffect} from 'react';
import Graph from 'graphology-types';
import {GraphModel} from '../lib/straighten';
import {useSetRecoilState, useRecoilValue, useRecoilState} from 'recoil';
import set from 'lodash/fp/set';

import * as atoms from './atoms';
import {ToolBoxState} from './atoms';

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useGraph() {
  const graph = useRecoilValue(atoms.graph);

  return graph;
}

export function useModel() {
  const model = useRecoilValue(atoms.model);

  return model;
}

export type ToolBoxActions = {
  setNodeColor(color: string): void;
  setNodeSize(size: string): void;
};

export function useToolBoxState(): [ToolBoxState, ToolBoxActions] {
  const [toolBoxState, setToolBoxState] = useRecoilState(atoms.toolBoxState);

  return [
    toolBoxState,
    {
      setNodeColor: nodeColor =>
        setToolBoxState(set(['variables', 'nodes', 'color'], nodeColor)),
      setNodeSize: nodeSize =>
        setToolBoxState(set(['variables', 'nodes', 'size'], nodeSize))
    }
  ];
}

export function useGraphVariables() {
  const variables = useRecoilValue(atoms.graphVariables);

  return variables;
}

export function useSetNewGraph() {
  const setView = useSetRecoilState(atoms.view);
  const setGraph = useSetRecoilState(atoms.graph);
  const setModal = useSetRecoilState(atoms.modal);
  const setModel = useSetRecoilState(atoms.model);
  const setToolBoxState = useSetRecoilState(atoms.toolBoxState);

  return (graph: Graph, model: GraphModel) => {
    const toolBoxState: ToolBoxState = {
      variables: {
        nodes: {
          color: null,
          size: null
        }
      }
    };

    setView('basemap');
    setModal(null);
    setGraph(graph);
    setModel(model);
    setToolBoxState(toolBoxState);
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
