import React, {useState} from 'react';
import cls from 'classnames';

import FileDrop, {DropPayload} from './FileDrop';
import {useSetNewGraph} from '../../actions';
import {importGraph} from '../../lib/import';

import './ImportModal.scss';

function ExampleList({onClick}) {
  return (
    <div className="content">
      <ul>
        <li>
          <a onClick={onClick}>Arctic graph</a>
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

  const setActiveTabIfDifferent = newActiveTab => {
    if (newActiveTab === activeTab) return;

    setActiveTab(newActiveTab);
  };

  const setGraph = useSetNewGraph();

  function doSetGraph(err, graph) {
    if (err) return console.error(err);

    setGraph(graph);
  }

  function loadExampleGraph() {
    importGraph({type: 'example', name: 'arctic'}, doSetGraph);
  }

  function onDrop(payload: DropPayload) {
    importGraph({type: 'text', format: 'gexf', text: payload.text}, doSetGraph);
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
          {activeTab === 'file' ? (
            <FileDrop onDrop={onDrop} />
          ) : (
            <ExampleList onClick={loadExampleGraph} />
          )}
        </div>
      </div>
    </div>
  );
}
