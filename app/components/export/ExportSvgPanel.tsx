import React, {useState} from 'react';
import {Button} from 'bloomer';

export default function ExportSvgPanel({graph, save}) {
  const [name, setName] = useState('graph.svg');

  return (
    <>
      <div className="field">
        <label className="label">File name</label>
        <div className="control"></div>
        <input
          className="input"
          type="text"
          placeholder="e.g. graph.svg"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <br />
      <br />
      <div>
        <Button
          onClick={() => save(graph, {name, format: 'svg'})}
          isColor="black">
          Download
        </Button>
      </div>
    </>
  );
}
