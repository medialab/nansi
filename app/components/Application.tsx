import React from 'react';
import {useRecoilValue} from 'recoil';

import * as atoms from '../atoms';
import BasemapView from './basemap';
import ImportModal from './import/ImportModal';

export default function Application() {
  const modal = useRecoilValue(atoms.modal);
  const view = useRecoilValue(atoms.view);

  let viewComponent = null;

  if (view === 'basemap') viewComponent = <BasemapView />;

  return (
    <>
      <ImportModal isOpen={modal === 'import'} />
      {viewComponent}
    </>
  );
}
