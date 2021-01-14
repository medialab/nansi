import React from 'react';

import {useGraph, useGraphVariables} from '../../hooks';

import GraphContainer from './GraphContainer';
import GraphInformation from './GraphInformation';
import GraphLegend from './GraphLegend';
import ToolBox from './ToolBox';

import './index.scss';

export default function BasemapView() {
  const graph = useGraph();
  const variables = useGraphVariables();

  if (!graph || !variables) return null;

  return (
    <div className="Basemap container-fluid">
      <ToolBox />
      <GraphContainer
        graph={graph}
        nodeColor={variables.nodeColor}
        nodeSize={variables.nodeSize}
        nodeLabel={variables.nodeLabel}
        labelDensity={variables.labelDensity}
      />
      <GraphLegend
        attribute={variables.nodeColor}
        graphHasTitle={graph.hasAttribute('title')}
      />
      <GraphInformation graph={graph} />
    </div>
  );
}
