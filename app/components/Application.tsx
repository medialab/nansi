import React from 'react';
import {useRecoilValue} from 'recoil';

import * as atoms from '../atoms';
import {useCloseModal, useGraph} from '../hooks';
import BasemapView from './basemap';
import ImportModal from './import/ImportModal';
import ExportModal from './export/ExportModal';

export default function Application() {
  const modal = useRecoilValue(atoms.modal);
  const view = useRecoilValue(atoms.view);
  const graph = useGraph();
  const closeModal = useCloseModal();

  let viewComponent = null;

  if (view === 'basemap') viewComponent = <BasemapView />;

  return (
    <>
      <ImportModal isOpen={modal === 'import'} disableClose={graph === null} close={closeModal} />
      <ExportModal isOpen={modal === 'export'} close={closeModal} />
      {viewComponent}
    </>
  );
}
