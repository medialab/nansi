import React, {useState} from 'react';
import {Button} from 'bloomer';

export default function ExportGexfPanel({graph, save}) {
  const [name, setName] = useState('graph.gexf');

  return (
    <>
      <div className="field">
        <label className="label">File name</label>
        <div className="control"></div>
        <input
          className="input"
          type="text"
          placeholder="e.g. graph.gexf"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <br />
      <br />
      <div>
        <Button
          onClick={() => save(graph, {name, format: 'gexf'})}
          isColor="black">
          Download
        </Button>
      </div>
    </>
  );
}
