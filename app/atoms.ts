import {atom} from 'recoil';

/**
 * View state atoms.
 */
export const view = atom({key: 'view', default: 'import'});

/**
 * Data atoms.
 */
export const graph = atom({key: 'graph', default: null});
