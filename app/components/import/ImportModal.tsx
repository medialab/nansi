import React, {useState} from 'react';
import cls from 'classnames';
import {Button} from 'bloomer';

import {setGraphInQuery, clearGraphFromQuery} from '../../lib/location';
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

function UrlImportForm({onSubmit}) {
  const [url, setUrl] = useState('');

  return (
    <div className="columns">
      <div className="column is-12">
        <div className="field">
          <div className="control">
            <input
              type="text"
              className="input"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://somewhere.com/data/hello-world.gexf"
            />
          </div>
        </div>
        <Button isColor="black" disabled={!url} onClick={() => onSubmit(url)}>
          Fetch
        </Button>
      </div>
    </div>
  );
}

const TABS = [
  {
    label: 'From file',
    tab: 'file'
  },
  {
    label: 'From example',
    tab: 'example'
  },
  {
    label: 'From url',
    tab: 'url'
  }
];

type ImportModalProps = {
  isOpen: boolean;
  close: () => void;
};

export default function ImportModal({isOpen, close}: ImportModalProps) {
  const [activeTab, setActiveTab] = useState('file');
  const [isLoading, setIsLoading] = useState(false);

  const setActiveTabIfDifferent = newActiveTab => {
    if (newActiveTab === activeTab) return;

    setActiveTab(newActiveTab);
  };

  const setGraph = useSetNewGraph();

  function onGraphImported(err, {graph, model, options}) {
    setIsLoading(false);
    if (err) return console.error(err);

    if (options.type === 'url') setGraphInQuery(options.url);
    else clearGraphFromQuery();

    setGraph(graph, model);
  }

  function loadExampleGraph(name) {
    setIsLoading(true);
    workerPool.import({type: 'example', name}, onGraphImported);
  }

  function loadUrl(url) {
    setIsLoading(true);
    workerPool.import({type: 'url', url: url.trim()}, onGraphImported);
  }

  function onDrop(file: File) {
    setIsLoading(true);
    workerPool.import({type: 'file', file}, onGraphImported);
  }

  let body = null;

  if (isLoading) {
    body = <progress className="progress is-dark is-large" />;
  } else {
    if (activeTab === 'file') body = <FileDrop onDrop={onDrop} />;
    else if (activeTab === 'example')
      body = <ExampleList onClick={loadExampleGraph} />;
    else if (activeTab === 'url') body = <UrlImportForm onSubmit={loadUrl} />;
  }

  return (
    <div id="ImportModal" className={cls('modal', isOpen && 'is-active')}>
      <div className="modal-background" onClick={close} />
      <div className="modal-content">
        <div className="import-modal-box">
          <h2>New project</h2>
          <div className="tabs">
            <ul>
              {TABS.map(item => {
                return (
                  <li
                    key={item.tab}
                    className={cls(activeTab === item.tab && 'is-active')}
                    onClick={setActiveTabIfDifferent.bind(null, item.tab)}>
                    <a>{item.label}</a>
                  </li>
                );
              })}
            </ul>
          </div>
          {body}
        </div>
      </div>
    </div>
  );
}
