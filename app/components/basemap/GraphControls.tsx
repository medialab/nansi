import React from 'react';
import RescaleIcon from 'material-icons-svg/components/baseline/CenterFocusWeak';
import ZoomInIcon from 'material-icons-svg/components/baseline/ZoomIn';
import ZoomOutIcon from 'material-icons-svg/components/baseline/ZoomOut';
import {WebGLRenderer} from 'sigma';

import './GraphControls.scss';

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

export function ControlButton({Icon, onClick}) {
  return (
    <div className="control-button" onClick={onClick}>
      <Icon height={32} width={32} />
    </div>
  );
}

type GraphControlsProps = {
  renderer: WebGLRenderer;
};

export default function GraphControls({renderer}: GraphControlsProps) {
  return (
    <div id="GraphControls">
      <ControlButton Icon={RescaleIcon} onClick={() => rescale(renderer)} />
      <ControlButton Icon={ZoomInIcon} onClick={() => zoomIn(renderer)} />
      <ControlButton Icon={ZoomOutIcon} onClick={() => zoomOut(renderer)} />
    </div>
  );
}
