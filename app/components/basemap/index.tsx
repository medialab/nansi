import React from 'react';

import {useGraph, useGraphVariables} from '../../hooks';

import GraphContainer from './GraphContainer';
import GraphInformation from './GraphInformation';
import ToolBox from './ToolBox';

import './index.scss';

export default function BasemapView() {
  const graph = useGraph();
  const variables = useGraphVariables();
  console.log('render');
  if (!graph || !variables) return null;

  return (
    <div className="Basemap container-fluid">
      <ToolBox />
      <GraphContainer
        graph={graph}
        nodeColor={variables.nodeColor}
        nodeSize={variables.nodeSize}
        extents={variables.extents}
      />
      <GraphInformation graph={graph} />
    </div>
  );
}
