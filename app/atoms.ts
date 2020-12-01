import Graph from 'graphology-types';
import {atom} from 'recoil';
import {GraphModel} from '../lib/straighten';

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

/**
 * Data atoms.
 */
export const graph = atom<Graph | null>({
  key: 'graph',
  default: null,
  dangerouslyAllowMutability: true
});

export const model = atom<GraphModel | null>({
  key: 'model',
  default: null
});

/**
 * Toolbox state.
 */
type ToolBoxState = {
  nodeColor: string;
};

export const toolboxState = atom<ToolBoxState | null>({
  key: 'toolboxState',
  default: null
});
