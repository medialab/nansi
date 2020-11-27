import React from 'react';
import {useRecoilValue} from 'recoil';

import * as atoms from '../../atoms';

import GraphContainer from './GraphContainer';
import GraphInformation from './GraphInformation';
import ToolBox from './ToolBox';

import './index.scss';

export default function BasemapView() {
  const graph = useRecoilValue(atoms.graph);

  if (!graph) return null;

  return (
    <div className="Basemap container-fluid">
      <ToolBox />
      <GraphContainer graph={graph} />
      <GraphInformation graph={graph} />
    </div>
  );
}
