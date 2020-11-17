import React from 'react';
import RescaleIcon from 'material-icons-svg/components/baseline/CenterFocusWeak';
import ZoomInIcon from 'material-icons-svg/components/baseline/ZoomIn';
import ZoomOutIcon from 'material-icons-svg/components/baseline/ZoomOut';

import './GraphControls.scss';

export function ControlButton({Icon, onClick}) {
  return (
    <div className="control-button" onClick={onClick}>
      <Icon height={32} width={32} />
    </div>
  );
}

export default function GraphControls({rescale, zoomIn, zoomOut}) {
  return (
    <div id="GraphControls">
      <ControlButton Icon={RescaleIcon} onClick={rescale} />
      <ControlButton Icon={ZoomInIcon} onClick={zoomIn} />
      <ControlButton Icon={ZoomOutIcon} onClick={zoomOut} />
    </div>
  );
}
