import React from 'react';
import {render} from 'react-dom';
import {useRecoilValue} from 'recoil';

import * as atoms from '../atoms';
import BasemapView from './basemap';
import ImportView from './import';

export default function Application() {
  const view = useRecoilValue(atoms.view);

  if (view === 'import') return <ImportView />;

  if (view === 'basemap') return <BasemapView />;

  throw new Error(`nansi.Application: unknown "${view}" view!`);
}
