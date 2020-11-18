import React from 'react';
import Graph from 'graphology';
import gexf from 'graphology-gexf/browser';

import FileDrop, {DropPayload} from './FileDrop';
import {useSetNewGraph} from '../../actions';

function LoadExampleButton({onClick}) {
  return (
    <button className="button" onClick={onClick}>
      Load GEXF Example
    </button>
  );
}

export default function ImportView() {
  const setGraph = useSetNewGraph();

  function loadExampleGraph() {
    fetch('./resources/arctic.gexf')
      .then(response => response.text())
      .then(text => {
        // TODO: temp, move this elsewhere
        const graph = gexf.parse(Graph, text);

        setGraph(graph);
      });
  }

  function onDrop(payload: DropPayload) {
    const graph = gexf.parse(Graph, payload.text);

    setGraph(graph);
  }

  return (
    <div className="container" style={{padding: '50px'}}>
      <LoadExampleButton onClick={loadExampleGraph} />
      <div>
        <FileDrop onDrop={onDrop} />
      </div>
    </div>
  );
}
