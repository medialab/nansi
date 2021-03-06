import Graph from 'graphology-types';
import Sigma from 'sigma';
import {atom, selector} from 'recoil';
import {GraphModel, SerializedGraphModelAttribute} from '../lib/straighten';

/**
 * View state atoms.
 */
type ModalAtomType = 'import' | 'export';
type ViewAtomType = 'basemap';

export const modal = atom<ModalAtomType | null>({
  key: 'modal',
  default: 'import'
});
export const view = atom<ViewAtomType>({key: 'view', default: 'basemap'});

export const isPreloadingGraph = atom<boolean>({
  key: 'preloadingGraph',
  default: false
});

/**
 * Graph atoms.
 */
export const graph = atom<Graph | null>({
  key: 'graph',
  default: null,
  dangerouslyAllowMutability: true
});

export const renderer = atom<Sigma | null>({
  key: 'renderer',
  default: null,
  dangerouslyAllowMutability: true
});

export const model = atom<GraphModel | null>({
  key: 'model',
  default: null
});

type GraphCollaterals = {
  initialLayout: Float64Array;
};

export const collaterals = atom<GraphCollaterals | null>({
  key: 'collaterals',
  default: null,
  dangerouslyAllowMutability: true
});

/**
 * Toolbox state.
 */
export type ToolBoxNodeVariables = {
  color: string | null;
  size: string | null;
};

export type ToolBoxEdgeVariables = {
  color: string | null;
  size: string | null;
};

export type ToolBoxLabelVariables = {
  text: string | null;
  density: number;
};

export type ToolBoxState = {
  variables: {
    nodes: ToolBoxNodeVariables;
    edges: ToolBoxEdgeVariables;
    labels: ToolBoxLabelVariables;
  };
};

export const toolBoxState = atom<ToolBoxState | null>({
  key: 'toolBoxState',
  default: null
});

/**
 * Selectors.
 */
export type GraphVariables = {
  nodeColor: SerializedGraphModelAttribute | null;
  nodeSize: SerializedGraphModelAttribute | null;
  nodeLabel: SerializedGraphModelAttribute | null;
  labelDensity: number;
  edgeColor: SerializedGraphModelAttribute | null;
  edgeSize: SerializedGraphModelAttribute | null;
};

export const graphVariables = selector<GraphVariables | null>({
  key: 'graphSelector',
  get: ({get}) => {
    const state = get(toolBoxState);
    const currentModel = get(model);

    if (!state || !currentModel) return null;

    return {
      nodeColor: state.variables.nodes.color
        ? currentModel.nodes[state.variables.nodes.color]
        : null,
      nodeSize: state.variables.nodes.size
        ? currentModel.nodes[state.variables.nodes.size]
        : null,
      nodeLabel: state.variables.labels.text
        ? currentModel.nodes[state.variables.labels.text]
        : null,
      labelDensity: state.variables.labels.density,
      edgeColor: state.variables.edges.color
        ? currentModel.edges[state.variables.edges.color]
        : null,
      edgeSize: state.variables.edges.size
        ? currentModel.edges[state.variables.edges.size]
        : null
    };
  }
});
