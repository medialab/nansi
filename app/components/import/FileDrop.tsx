import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';

import './FileDrop.scss';

export type DropPayload = {
  type: 'gexf';
  text: string;
};

type FileDropProps = {
  onDrop: (payload: DropPayload) => void;
};

export default function FileDrop({onDrop}: FileDropProps) {
  const dropCallback = useCallback(acceptedFiles => {
    const reader = new FileReader();

    reader.onload = e => {
      const text = e.target.result as string;

      onDrop({
        type: 'gexf',
        text
      });
    };

    reader.readAsText(acceptedFiles[0]);
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop: dropCallback
  });

  return (
    <div className="FileDrop" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <div>Just drop here!</div>
      ) : (
        <div>Drop gexf file here...</div>
      )}
    </div>
  );
}
