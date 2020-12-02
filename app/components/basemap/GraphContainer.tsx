import React, {useCallback, useRef, useState} from 'react';
import Graph from 'graphology';
import {WebGLRenderer} from 'sigma';
import {scaleLinear} from 'd3-scale';

import {usePrevious} from '../../hooks';
import GraphControls from './GraphControls';
import {GraphModelExtents} from '../../../lib/straighten';

import './GraphContainer.scss';

// Defaults
const DEFAULT_NODE_COLOR = '#999';
const DEFAULT_NODE_SIZE_RANGE = [2, 15];

// Camera controls
function rescale(renderer: WebGLRenderer): void {
  const camera = renderer.getCamera();
  camera.animatedReset(renderer);
}

function zoomIn(renderer: WebGLRenderer): void {
  const camera = renderer.getCamera();
  camera.animatedZoom(renderer);
}

function zoomOut(renderer: WebGLRenderer): void {
  const camera = renderer.getCamera();
  camera.animatedUnzoom(renderer);
}

type GraphContainerProps = {
  graph: Graph;
  nodeColor: any;
  nodeSize: any;
  extents: GraphModelExtents;
};

type RenderedNode = {
  x: number;
  y: number;
  label: string;
  size?: number;
  color?: string;
};

export default function GraphContainer({
  graph,
  nodeColor,
  nodeSize,
  extents
}: GraphContainerProps) {
  const previousNodeColor = usePrevious(nodeColor);
  const previousNodeSize = usePrevious(nodeSize);

  const nodeSizeScale = scaleLinear()
    .domain([extents.nodeSize.min, extents.nodeSize.max])
    .range(DEFAULT_NODE_SIZE_RANGE);

  const nodeReducer = function (key, attr) {
    const renderedNode: RenderedNode = {
      x: attr.x,
      y: attr.y,
      label: attr.label
    };

    // Color
    if (!nodeColor) {
      renderedNode.color = attr.color || DEFAULT_NODE_COLOR;
    } else {
      renderedNode.color =
        nodeColor.palette[attr[nodeColor.name]] || DEFAULT_NODE_COLOR;
    }

    // Size
    if (!nodeSize) {
      renderedNode.size = nodeSizeScale(attr.size || 1);
    }

    return renderedNode;
  };

  const container = useRef(null);
  const [renderer, setRenderer] = useState(null);

  // Should we refresh?
  if (renderer) {
    if (previousNodeColor !== nodeColor || previousNodeSize !== nodeSize) {
      console.log('Refreshing sigma');

      // TODO: use upcoming #.setNodeReducer
      renderer.settings.nodeReducer = nodeReducer;
      renderer.refresh();
    }
  }

  const setContainer = useCallback(
    node => {
      if (renderer && renderer.graph !== graph) {
        renderer.kill();
      }

      if (node && graph) {
        setRenderer(new WebGLRenderer(graph, node, {nodeReducer}));
      }

      container.current = node;
    },
    [graph]
  );

  return (
    <div id="GraphContainer">
      <div ref={setContainer} style={{width: '100%', height: '100%'}}></div>
      {renderer && (
        <GraphControls
          rescale={rescale.bind(null, renderer)}
          zoomIn={zoomIn.bind(null, renderer)}
          zoomOut={zoomOut.bind(null, renderer)}
        />
      )}
    </div>
  );
}
