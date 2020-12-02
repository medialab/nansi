import {useRef, useEffect} from 'react';
import Graph from 'graphology-types';
import {GraphModel} from '../lib/straighten';
import {
  useSetRecoilState,
  useRecoilValue,
  useRecoilState,
  useRecoilCallback
} from 'recoil';
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
  setNodeLabel(label: string): void;
};

export function useToolBoxState(): [ToolBoxState, ToolBoxActions] {
  const [toolBoxState, setToolBoxState] = useRecoilState(atoms.toolBoxState);

  return [
    toolBoxState,
    {
      setNodeColor: nodeColor =>
        setToolBoxState(set(['variables', 'nodes', 'color'], nodeColor)),
      setNodeSize: nodeSize =>
        setToolBoxState(set(['variables', 'nodes', 'size'], nodeSize)),
      setNodeLabel: nodeLabel =>
        setToolBoxState(set(['variables', 'labels', 'text'], nodeLabel))
    }
  ];
}

export function useGraphVariables() {
  const variables = useRecoilValue(atoms.graphVariables);

  return variables;
}

export function useSetNewGraph() {
  return useRecoilCallback(
    ({set}) => (graph: Graph, model: GraphModel) => {
      // Initializing toolbox state
      const toolBoxState: ToolBoxState = {
        variables: {
          nodes: {
            color: null,
            size: null
          },
          labels: {
            text: null
          }
        }
      };

      // Batch updates
      set(atoms.view, 'basemap');
      set(atoms.modal, null);
      set(atoms.graph, graph);
      set(atoms.model, model);
      set(atoms.toolBoxState, toolBoxState);
    },
    []
  );
}

export function useOpenModal() {
  const setModal = useSetRecoilState(atoms.modal);

  return setModal;
}

export function useCloseModal() {
  const setModal = useSetRecoilState(atoms.modal);

  return () => setModal(null);
}
