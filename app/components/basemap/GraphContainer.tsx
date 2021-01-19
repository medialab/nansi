import React, {useCallback, useRef} from 'react';
import Graph from 'graphology';
import {WebGLRenderer} from 'sigma';
import {scaleLinear} from 'd3-scale';

import {SerializedGraphModelAttribute} from '../../../lib/straighten';
import {usePrevious, useRenderer} from '../../hooks';
import GraphControls from './GraphControls';
import {createNodeReducer, createEdgeReducer} from '../../../lib/reducers';

import './GraphContainer.scss';

// Defaults
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
  nodeColor: SerializedGraphModelAttribute | null;
  nodeSize: SerializedGraphModelAttribute | null;
  nodeLabel: SerializedGraphModelAttribute | null;
  edgeColor: SerializedGraphModelAttribute | null;
  edgeSize: SerializedGraphModelAttribute | null;
  labelDensity: number;
};

export default function GraphContainer({
  graph,
  nodeColor,
  nodeSize,
  nodeLabel,
  edgeSize,
  edgeColor,
  labelDensity
}: GraphContainerProps) {
  const previousNodeColor = usePrevious(nodeColor);
  const previousNodeSize = usePrevious(nodeSize);
  const previousNodeLabel = usePrevious(nodeLabel);
  const previousEdgeColor = usePrevious(edgeColor);
  const previousEdgeSize = usePrevious(edgeSize);
  const previousLabelDensity = usePrevious(labelDensity);

  const nodeReducer = createNodeReducer({
    nodeColor,
    nodeSize,
    nodeLabel
  });

  const edgeReducer = createEdgeReducer({
    edgeSize,
    edgeColor
  });

  const container = useRef(null);
  const [renderer, setRenderer] = useRenderer();

  // Should we refresh?
  if (renderer) {
    let needToRefresh = false;

    if (
      previousNodeColor !== nodeColor ||
      previousNodeSize !== nodeSize ||
      previousNodeLabel !== nodeLabel ||
      previousEdgeSize !== edgeSize ||
      previousEdgeColor !== edgeColor
    ) {
      console.log('Refreshing sigma');

      // TODO: use upcoming #.setNodeReducer
      renderer.settings.nodeReducer = nodeReducer;
      renderer.settings.edgeReducer = edgeReducer;
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
        const newRenderer = new WebGLRenderer(graph, node, {
          nodeReducer,
          edgeReducer
        });
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
