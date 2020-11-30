import React, {useCallback, useRef, useState} from 'react';
import {WebGLRenderer} from 'sigma';

import GraphControls from './GraphControls';

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

export default function GraphContainer({graph}) {
  const ref = useRef(null);
  const [renderer, setRenderer] = useState(null);

  const setRef = useCallback(
    node => {
      if (renderer && renderer.graph !== graph) {
        renderer.kill();
      }

      if (node && graph) {
        setRenderer(new WebGLRenderer(graph, node));
      }

      ref.current = node;
    },
    [graph]
  );

  return (
    <div id="GraphContainer">
      <div ref={setRef} style={{width: '100%', height: '100%'}}></div>
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
