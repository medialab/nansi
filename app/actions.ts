import {useSetRecoilState} from 'recoil';

import * as atoms from './atoms';

export function useSetNewGraph() {
  const setView = useSetRecoilState(atoms.view);
  const setGraph = useSetRecoilState(atoms.graph);

  return graph => {
    setView('basemap');
    setGraph(graph);
  };
}
