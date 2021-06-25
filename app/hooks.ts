import {useRef, useEffect} from 'react';
import Graph from 'graphology-types';
import {GraphModel} from '../lib/straighten';
import {exportLayout, applyLayout} from '../lib/utils';
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

export function useRenderer() {
  return useRecoilState(atoms.renderer);
}

export function useModel() {
  const model = useRecoilValue(atoms.model);

  return model;
}

export type ToolBoxActions = {
  setNodeColor(color: string): void;
  setNodeSize(size: string): void;
  setNodeLabel(label: string): void;
  setLabelDensity(density: number): void;
  setEdgeColor(color: string): void;
  setEdgeSize(size: string): void;
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
        setToolBoxState(set(['variables', 'labels', 'text'], nodeLabel)),
      setLabelDensity: density =>
        setToolBoxState(set(['variables', 'labels', 'density'], density)),
      setEdgeColor: edgeColor =>
        setToolBoxState(set(['variables', 'edges', 'color'], edgeColor)),
      setEdgeSize: edgeSize =>
        setToolBoxState(set(['variables', 'edges', 'size'], edgeSize))
    }
  ];
}

export function useGraphVariables() {
  const variables = useRecoilValue(atoms.graphVariables);

  return variables;
}

export function useSetNewGraph() {
  return useRecoilCallback(
    ({set}) =>
      (graph: Graph, model: GraphModel) => {
        // Initializing toolbox state
        const toolBoxState: ToolBoxState = {
          variables: {
            nodes: {
              color: model.defaultNodeColor,
              size: model.defaultNodeSize
            },
            edges: {
              color: model.defaultEdgeColor,
              size: model.defaultEdgeSize
            },
            labels: {
              text: model.defaultNodeLabel,
              density: 0.25
            }
          }
        };

        // Batch updates
        set(atoms.view, 'basemap');
        set(atoms.modal, null);
        set(atoms.graph, graph);
        set(atoms.model, model);
        set(atoms.toolBoxState, toolBoxState);
        set(atoms.collaterals, {
          initialLayout: exportLayout(graph)
        });
      },
    []
  );
}

export function useResetLayout() {
  const collaterals = useRecoilValue(atoms.collaterals);
  const graph = useRecoilValue(atoms.graph);
  const renderer = useRecoilValue(atoms.renderer);

  return () => {
    if (!collaterals) return;

    applyLayout(graph, collaterals.initialLayout);

    // TODO: drop this later when batch updates are supported in sigma
    renderer.refresh();
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

export function useIsPreloadingGraph() {
  return useRecoilState(atoms.isPreloadingGraph);
}

export function useCanvas(callback, deps = []) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    callback(canvas, ctx);
  }, deps);

  return canvasRef;
}
