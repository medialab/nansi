import React, {useState} from 'react';
import cls from 'classnames';
import ToLeftIcon from 'material-icons-svg/components/baseline/KeyboardArrowLeft';
import ToRightIcon from 'material-icons-svg/components/baseline/KeyboardArrowRight';
import NewProjectIcon from 'material-icons-svg/components/baseline/FileCopy';

import {useOpenModal} from '../../actions';
import ToolBoxIcon from './ToolBoxIcon';

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
  const openModal = useOpenModal();

  return (
    <div id="ToolBox" className={cls(expanded && 'expanded')}>
      <div className="columns">
        <div className="column is-10">
          <h1>Nansi</h1>
        </div>
        <div className="column is-2">
          <ToolBoxIcon
            Icon={NewProjectIcon}
            hint="Create a new project"
            hintPosition="bottom"
            onClick={() => openModal('import')}
          />
        </div>
      </div>
      <ControlButton
        Icon={expanded ? ToLeftIcon : ToRightIcon}
        onClick={() => setExpanded(!expanded)}
      />
    </div>
  );
}
