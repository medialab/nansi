import React, {useState} from 'react';
import cls from 'classnames';

import FileDrop from './FileDrop';
import {useSetNewGraph} from '../../hooks';
import workerPool from '../../workers/pool';

import './ImportModal.scss';

function ExampleList({onClick}) {
  return (
    <div className="content">
      <ul>
        <li>
          <a onClick={() => onClick('arctic')}>Arctic graph</a>
        </li>
        <li>
          <a onClick={() => onClick('rio')}>RIO graph</a>
        </li>
      </ul>
    </div>
  );
}

type ImportModalProps = {
  isOpen: boolean;
};

export default function ImportModal({isOpen}: ImportModalProps) {
  const [activeTab, setActiveTab] = useState('file');
  const [isLoading, setIsLoading] = useState(false);

  const setActiveTabIfDifferent = newActiveTab => {
    if (newActiveTab === activeTab) return;

    setActiveTab(newActiveTab);
  };

  const setGraph = useSetNewGraph();

  function onGraphImported(err, {graph, model}) {
    setIsLoading(false);
    if (err) return console.error(err);

    setGraph(graph, model);
  }

  function loadExampleGraph(name) {
    setIsLoading(true);
    workerPool.import({type: 'example', name}, onGraphImported);
  }

  function onDrop(file: File) {
    setIsLoading(true);
    workerPool.import({type: 'file', file}, onGraphImported);
  }

  let body = null;

  if (isLoading) {
    body = <progress className="progress is-dark is-large" />;
  } else {
    body =
      activeTab === 'file' ? (
        <FileDrop onDrop={onDrop} />
      ) : (
        <ExampleList onClick={loadExampleGraph} />
      );
  }

  return (
    <div id="ImportModal" className={cls('modal', isOpen && 'is-active')}>
      <div className="modal-background" />
      <div className="modal-content">
        <div className="import-modal-box">
          <h2>New project</h2>
          <div className="tabs">
            <ul>
              <li
                className={cls(activeTab === 'file' && 'is-active')}
                onClick={setActiveTabIfDifferent.bind(null, 'file')}>
                <a>From file</a>
              </li>
            </ul>
            <ul>
              <li
                className={cls(activeTab === 'example' && 'is-active')}
                onClick={setActiveTabIfDifferent.bind(null, 'example')}>
                <a>From example</a>
              </li>
            </ul>
          </div>
          {body}
        </div>
      </div>
    </div>
  );
}
