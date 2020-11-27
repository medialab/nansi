import Graph from 'graphology-types';
import {atom} from 'recoil';

/**
 * View state atoms.
 */
export const modal = atom<string>({key: 'modal', default: 'import'});
export const view = atom<string>({key: 'view', default: 'basemap'});

/**
 * Data atoms.
 */
export const graph = atom<Graph>({
  key: 'graph',
  default: null,
  dangerouslyAllowMutability: true
});
