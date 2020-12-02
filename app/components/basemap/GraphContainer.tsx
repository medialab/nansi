import React, {useCallback, useRef, useState} from 'react';
import Graph from 'graphology';
import {WebGLRenderer} from 'sigma';
import {scaleLinear} from 'd3-scale';

import {usePrevious, useRenderer} from '../../hooks';
import GraphControls from './GraphControls';
import {GraphModelExtents} from '../../../lib/straighten';

import './GraphContainer.scss';

// Defaults
const DEFAULT_NODE_COLOR = '#999';
const DEFAULT_NODE_SIZE_RANGE = [2, 15];
const CELL_HEIGHT_RANGE = [200, 10];
const CELL_WIDTH_RANGE = [300, 30];

const CELL_HEIGHT_SCALE = scaleLinear().domain([0, 1]).range(CELL_HEIGHT_RANGE);
const CELL_WIDTH_SCALE = scaleLinear().domain([0, 1]).range(CELL_WIDTH_RANGE);

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
  nodeLabel: any;
  labelDensity: number;
  extents: GraphModelExtents;
};

type RenderedNode = {
  x: number;
  y: number;
  label?: string;
  size?: number;
  color?: string;
};

export default function GraphContainer({
  graph,
  nodeColor,
  nodeSize,
  nodeLabel,
  labelDensity,
  extents
}: GraphContainerProps) {
  const previousNodeColor = usePrevious(nodeColor);
  const previousNodeSize = usePrevious(nodeSize);
  const previousNodeLabel = usePrevious(nodeLabel);
  const previousLabelDensity = usePrevious(labelDensity);

  let nodeSizeScale = null;

  if (!nodeSize) {
    nodeSizeScale = scaleLinear()
      .domain([extents.nodeSize.min, extents.nodeSize.max])
      .range(DEFAULT_NODE_SIZE_RANGE);
  } else {
    nodeSizeScale = scaleLinear()
      .domain([nodeSize.min, nodeSize.max])
      .range(DEFAULT_NODE_SIZE_RANGE);
  }

  const nodeReducer = function (key, attr) {
    const renderedNode: RenderedNode = {
      x: attr.x,
      y: attr.y
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
    } else {
      let v = attr[nodeSize.name];
      renderedNode.size = nodeSizeScale(typeof v === 'number' ? v : 1);
    }

    // Label
    if (!nodeLabel) {
      renderedNode.label = attr.label || key;
    } else {
      renderedNode.label = attr[nodeLabel.name] || '<no-label>';
    }

    return renderedNode;
  };

  const container = useRef(null);
  const [renderer, setRenderer] = useRenderer();

  // Should we refresh?
  if (renderer) {
    let needToRefresh = false;

    if (
      previousNodeColor !== nodeColor ||
      previousNodeSize !== nodeSize ||
      previousNodeLabel !== nodeLabel
    ) {
      console.log('Refreshing sigma');

      // TODO: use upcoming #.setNodeReducer
      renderer.settings.nodeReducer = nodeReducer;
      needToRefresh = true;
    }

    if (previousLabelDensity !== labelDensity) {
      renderer.settings.labelGrid.cell = {
        width: CELL_WIDTH_SCALE(labelDensity),
        height: CELL_HEIGHT_SCALE(labelDensity)
      };

      // TODO: we can improve sigma to handle this
      renderer.displayedLabels = new Set();
      needToRefresh = true;
    }

    if (needToRefresh) renderer.refresh();
  }

  const setContainer = useCallback(
    node => {
      if (renderer && renderer.graph !== graph) {
        renderer.kill();
        setRenderer(null);
      }

      if (node && graph) {
        const newRenderer = new WebGLRenderer(graph, node, {nodeReducer});
        setRenderer(newRenderer);
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
