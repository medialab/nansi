import React from 'react';
import {useRecoilValue} from 'recoil';

import * as atoms from '../../atoms';

import GraphControls from './GraphControls';
import GraphContainer from './GraphContainer';
import GraphInformation from './GraphInformation';

import './index.scss';

export default function BasemapView() {
  const graph = useRecoilValue(atoms.graph);

  return (
    <div className="Basemap container-fluid">
      <GraphContainer />
      <GraphControls />
      <GraphInformation graph={graph} />
    </div>
  );
}
