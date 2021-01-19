import React from 'react';

import {useGraph, useGraphVariables, useModel} from '../../hooks';

import GraphContainer from './GraphContainer';
import GraphInformation from './GraphInformation';
import GraphLegend from './GraphLegend';
import GraphSearch from './GraphSearch';
import ToolBox from './ToolBox';

import './index.scss';

export default function BasemapView() {
  const graph = useGraph();
  const model = useModel();
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
        edgeColor={variables.edgeColor}
        edgeSize={variables.edgeSize}
        labelDensity={variables.labelDensity}
      />
      <GraphSearch />
      <GraphLegend
        attribute={variables.nodeColor}
        graphHasTitle={graph.hasAttribute('title')}
      />
      <GraphInformation graph={graph} weighted={model.weighted} />
    </div>
  );
}
