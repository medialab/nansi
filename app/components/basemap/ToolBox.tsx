import React, {useState} from 'react';
import cls from 'classnames';
import ToLeftIcon from 'material-icons-svg/components/baseline/KeyboardArrowLeft';
import ToRightIcon from 'material-icons-svg/components/baseline/KeyboardArrowRight';

import './ToolBox.scss';

export function ControlButton({Icon, onClick = null}) {
  return (
    <div className="control-button" onClick={onClick}>
      <Icon height={32} width={32} />
    </div>
  );
}

export default function ToolBox() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div id="ToolBox" className={cls(expanded && 'expanded')}>
      ToolBox WIP
      <ControlButton
        Icon={expanded ? ToLeftIcon : ToRightIcon}
        onClick={() => setExpanded(!expanded)}
      />
    </div>
  );
}
