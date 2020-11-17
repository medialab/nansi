import React from 'react';
import RescaleIcon from 'material-icons-svg/components/baseline/CenterFocusWeak';
import ZoomInIcon from 'material-icons-svg/components/baseline/ZoomIn';
import ZoomOutIcon from 'material-icons-svg/components/baseline/ZoomOut';

import './Controls.scss';

function ControlButton({Icon}) {
  return (
    <div className="control-button">
      <Icon height={32} width={32} />
    </div>
  );
}

export default function Controls() {
  return (
    <div id="BasemapControls">
      <ControlButton Icon={RescaleIcon} />
      <ControlButton Icon={ZoomInIcon} />
      <ControlButton Icon={ZoomOutIcon} />
    </div>
  );
}
