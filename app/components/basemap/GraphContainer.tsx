import React, {useRef} from 'react';
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
  const container = useRef(null);
  let renderer = null;

  if (container.current) {
    renderer = new WebGLRenderer(graph, container.current);
  }

  return (
    <div id="GraphContainer">
      <div ref={container} style={{width: '100%', height: '100%'}}></div>
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
