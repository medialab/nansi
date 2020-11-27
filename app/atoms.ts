import Graph from 'graphology-types';
import {atom} from 'recoil';

/**
 * Types.
 */
type ModalAtomType = 'import';
type ViewAtomType = 'basemap';

/**
 * View state atoms.
 */
export const modal = atom<ModalAtomType>({key: 'modal', default: 'import'});
export const view = atom<ViewAtomType>({key: 'view', default: 'basemap'});

/**
 * Data atoms.
 */
export const graph = atom<Graph>({
  key: 'graph',
  default: null,
  dangerouslyAllowMutability: true
});
