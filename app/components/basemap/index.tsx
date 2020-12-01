import React from 'react';

import {useGraph, useToolBoxState} from '../../hooks';

import GraphContainer from './GraphContainer';
import GraphInformation from './GraphInformation';
import ToolBox from './ToolBox';

import './index.scss';

export default function BasemapView() {
  const graph = useGraph();
  const [toolBoxState] = useToolBoxState();

  if (!graph || !toolBoxState) return null;

  return (
    <div className="Basemap container-fluid">
      <ToolBox />
      <GraphContainer
        graph={graph}
        nodeColor={toolBoxState.variables.nodes.color}
      />
      <GraphInformation graph={graph} />
    </div>
  );
}
