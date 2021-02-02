import React from 'react';
import {useRecoilValue} from 'recoil';

import * as atoms from '../atoms';
import {useCloseModal, useGraph} from '../hooks';
import BasemapView from './basemap';
import ImportModal from './import/ImportModal';
import ExportModal from './export/ExportModal';
import Lifecycle from './lifecycle/Lifecycle';
import Intro from './intro';

export default function Application() {
  const modal = useRecoilValue(atoms.modal);
  const view = useRecoilValue(atoms.view);
  const graph = useGraph();
  const closeModal = useCloseModal();

  let viewComponent = null;

  if (view === 'basemap') viewComponent = <BasemapView />;

  return (
    <>
      {graph ===  null ? <Intro /> : null}
      <Lifecycle />
      <ImportModal
        isOpen={modal === 'import'}
        close={graph !== null ? closeModal : null}
      />
      <ExportModal isOpen={modal === 'export'} close={closeModal} />
      {viewComponent}
    </>
  );
}
