import React from 'react';
import {useRecoilValue} from 'recoil';

import * as atoms from '../../atoms';

import GraphContainer from './GraphContainer';
import GraphInformation from './GraphInformation';

import './index.scss';

export default function BasemapView() {
  const graph = useRecoilValue(atoms.graph);

  return (
    <div className="Basemap container-fluid">
      <GraphContainer graph={graph} />
      <GraphInformation graph={graph} />
    </div>
  );
}
