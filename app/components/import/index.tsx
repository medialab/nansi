import React from 'react';
import {useSetRecoilState} from 'recoil';
import Graph from 'graphology';
import gexf from 'graphology-gexf/browser';

import FileDrop, {DropPayload} from './FileDrop';
import * as atoms from '../../atoms';

function LoadExampleButton({onClick}) {
  return (
    <button className="button" onClick={onClick}>
      Load GEXF Example
    </button>
  );
}

export default function ImportView() {
  const setView = useSetRecoilState(atoms.view);
  const setGraph = useSetRecoilState(atoms.graph);

  function loadExampleGraph() {
    fetch('./resources/arctic.gexf')
      .then(response => response.text())
      .then(text => {
        // TODO: temp, move this elsewhere
        const graph = gexf.parse(Graph, text);

        setGraph(graph);
        setView('basemap');
      });
  }

  function onDrop(payload: DropPayload) {
    const graph = gexf.parse(Graph, payload.text);

    setGraph(graph);
    setView('basemap');
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
