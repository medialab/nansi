import React, {useState} from 'react';
import cls from 'classnames';
import {Button} from 'bloomer';

import {setGraphInQuery, clearGraphFromQuery} from '../../lib/location';
import FileDrop from './FileDrop';
import {useSetNewGraph, useIsPreloadingGraph} from '../../hooks';
import workerPool from '../../workers/pool';

import './ImportModal.scss';

const EXAMPLES = [
  {id: 'arctic', label: 'Arctic graph'},
  {id: 'rio', label: 'RIO graph'},
  {id: 'basic', label: 'Basic graph'},
  {id: 'les-miserables', label: 'Les Misérables graph'},
  {id: 'sparse-monopartite', label: 'Sparse monopartite projection graph'},
  {id: 'c-elegans', label: 'Caenorhabditis elegans graph'},
  {id: 'eurosis', label: 'EuroSiS'}
];

function ExampleList({onClick}) {
  return (
    <div className="content">
      <ul>
        {EXAMPLES.map(example => {
          return (
            <li key={example.id}>
              <a onClick={() => onClick(example.id)}>{example.label}</a>
            </li>
          );
        })}
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
  canClose: boolean;
};

export default function ImportModal({isOpen, close, canClose}: ImportModalProps) {
  let [activeTab, setActiveTab] = useState('file');
  const [isLoading, setIsLoading] = useState(false);
  const [isPreloadingGraph] = useIsPreloadingGraph();

  if (isPreloadingGraph) {
    activeTab = 'url';
  }

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

  if (isLoading || isPreloadingGraph) {
    body = <progress className="progress is-dark is-large" />;
  } else {
    if (activeTab === 'file') body = <FileDrop onDrop={onDrop} />;
    else if (activeTab === 'example')
      body = <ExampleList onClick={loadExampleGraph} />;
    else if (activeTab === 'url') body = <UrlImportForm onSubmit={loadUrl} />;
  }

  return (
    <div id="ImportModal" className={cls('modal', {'is-active' : isOpen, 'cant-close': !canClose})}>
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
