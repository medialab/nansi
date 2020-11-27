import React, {useCallback, useRef} from 'react';
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
  const rendererRef = useRef(null);

  const setRef = useCallback(
    node => {
      if (rendererRef.current) {
        rendererRef.current.kill();
      }

      if (node) rendererRef.current = new WebGLRenderer(graph, node);

      ref.current = node;
    },
    [graph]
  );

  return (
    <div id="GraphContainer">
      <div ref={setRef} style={{width: '100%', height: '100%'}}></div>
      {rendererRef.current && (
        <GraphControls
          rescale={rescale.bind(null, rendererRef.current)}
          zoomIn={zoomIn.bind(null, rendererRef.current)}
          zoomOut={zoomOut.bind(null, rendererRef.current)}
        />
      )}
    </div>
  );
}
