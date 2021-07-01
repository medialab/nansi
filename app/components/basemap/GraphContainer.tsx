import React, {useCallback, useRef} from 'react';
import Graph from 'graphology';
import {Sigma} from 'sigma';
import {scaleLinear} from 'd3-scale';

import {SerializedGraphModelAttribute} from '../../../lib/straighten';
import {usePrevious, useRenderer} from '../../hooks';
import {createNodeReducer, createEdgeReducer} from '../../../lib/reducers';

import './GraphContainer.scss';

// Defaults
const CELL_HEIGHT_RANGE = [200, 10];
const CELL_WIDTH_RANGE = [300, 30];
const CELL_HEIGHT_SCALE = scaleLinear().domain([0, 1]).range(CELL_HEIGHT_RANGE);
const CELL_WIDTH_SCALE = scaleLinear().domain([0, 1]).range(CELL_WIDTH_RANGE);

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

  // Do we need to edit settings (it will trigger a sigma refresh on its own)
  if (renderer) {
    if (
      previousNodeColor !== nodeColor ||
      previousNodeSize !== nodeSize ||
      previousNodeLabel !== nodeLabel ||
      previousEdgeSize !== edgeSize ||
      previousEdgeColor !== edgeColor
    ) {
      console.log('Refreshing sigma');

      renderer.setSetting('nodeReducer', nodeReducer);
      renderer.setSetting('edgeReducer', edgeReducer);
    }

    if (previousLabelDensity !== labelDensity) {
      renderer.updateSetting('labelGrid', current => {
        return {
          ...current,
          cell: {
            width: CELL_WIDTH_SCALE(labelDensity),
            height: CELL_HEIGHT_SCALE(labelDensity)
          }
        };
      });

      // TODO: we can improve sigma to handle this
      renderer['displayedLabels'] = new Set();
    }
  }

  const setContainer = useCallback(
    node => {
      if (renderer && renderer.getGraph() !== graph) {
        renderer.kill();
        setRenderer(null);
      }

      if (node && graph) {
        const newRenderer = new Sigma(graph, node, {
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
    </div>
  );
}
