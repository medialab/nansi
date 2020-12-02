import React, {useCallback, useRef, useState} from 'react';
import Graph from 'graphology';
import {WebGLRenderer} from 'sigma';

import {usePrevious} from '../../hooks';
import GraphControls from './GraphControls';
import {GraphModelAttribute} from '../../../lib/straighten';

import './GraphContainer.scss';

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
  nodeColor: GraphModelAttribute | null;
};

type RenderedNode = {
  x: number;
  y: number;
  label: string;
  size: number;
  color?: string;
};

export default function GraphContainer({
  graph,
  nodeColor
}: GraphContainerProps) {
  const previousNodeColor = usePrevious(nodeColor);

  const nodeReducer = function (key, attr) {
    const renderedNode: RenderedNode = {
      x: attr.x,
      y: attr.y,
      label: attr.label,
      size: attr.size
    };

    // Color
    if (!nodeColor) {
      renderedNode.color = attr.color || '#999';
    }

    return renderedNode;
  };

  const container = useRef(null);
  const [renderer, setRenderer] = useState(null);

  // Should we refresh?
  if (renderer) {
    if (previousNodeColor !== nodeColor) {
      console.log('Refreshing sigma');
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
