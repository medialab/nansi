import React, {useCallback, useRef} from 'react';
import Graph from 'graphology';
import {Sigma} from 'sigma';

import {SerializedGraphModelAttribute} from '../../../lib/straighten';
import {usePrevious, useRenderer} from '../../hooks';
import {createNodeReducer, createEdgeReducer} from '../../../lib/reducers';

import './GraphContainer.scss';

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

  // Should we update the renderer's settings
  if (renderer) {
    if (
      previousNodeColor !== nodeColor ||
      previousNodeSize !== nodeSize ||
      previousNodeLabel !== nodeLabel ||
      previousEdgeSize !== edgeSize ||
      previousEdgeColor !== edgeColor
    ) {
      renderer.setSetting('nodeReducer', nodeReducer);
      renderer.setSetting('edgeReducer', edgeReducer);
    }

    if (previousLabelDensity !== labelDensity) {
      renderer.setSetting('labelDensity', labelDensity);
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
