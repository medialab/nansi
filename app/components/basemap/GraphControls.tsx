import React from 'react';
import RescaleIcon from 'material-icons-svg/components/baseline/CenterFocusWeak';
import ZoomInIcon from 'material-icons-svg/components/baseline/ZoomIn';
import ZoomOutIcon from 'material-icons-svg/components/baseline/ZoomOut';
import {Sigma} from 'sigma';

import './GraphControls.scss';

function rescale(renderer: Sigma): void {
  const camera = renderer.getCamera();
  camera.animatedReset({}); // TODO: simplify when sigma typings are fixed
}

function zoomIn(renderer: Sigma): void {
  const camera = renderer.getCamera();
  camera.animatedZoom(1.5); // TODO: simplify when sigma typings are fixed
}

function zoomOut(renderer: Sigma): void {
  const camera = renderer.getCamera();
  camera.animatedUnzoom(1.5); // TODO: simplify when sigma typings are fixed
}

export function ControlButton({Icon, onClick}) {
  return (
    <div className="control-button" onClick={onClick}>
      <Icon height={32} width={32} />
    </div>
  );
}

type GraphControlsProps = {
  renderer: Sigma;
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
