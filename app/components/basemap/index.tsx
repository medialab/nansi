import React from 'react';

import {useGraph, useGraphVariables, useModel, useRenderer} from '../../hooks';

import GraphContainer from './GraphContainer';
import GraphControls from './GraphControls';
import GraphInformation from './GraphInformation';
import GraphLegend from './GraphLegend';
import GraphSearch from './GraphSearch';
import ToolBox from './ToolBox';

import './index.scss';

export default function BasemapView() {
  const graph = useGraph();
  const model = useModel();
  const variables = useGraphVariables();
  const [renderer] = useRenderer();

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
      {renderer && <GraphControls renderer={renderer} />}
      {renderer && (
        <GraphSearch
          renderer={renderer}
          graph={graph}
          targetAttribute={variables.nodeLabel}
        />
      )}
      <GraphLegend
        attribute={variables.nodeColor}
        graphHasTitle={graph.hasAttribute('title')}
      />
      <GraphInformation graph={graph} weighted={model.weighted} />
    </div>
  );
}
