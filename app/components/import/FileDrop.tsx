import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';

import './FileDrop.scss';

type FileDropProps = {
  onDrop: (file: File) => void;
};

export default function FileDrop({onDrop}: FileDropProps) {
  const dropCallback = useCallback(acceptedFiles => {
    onDrop(acceptedFiles[0]);
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop: dropCallback
  });

  return (
    <div className="FileDrop" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <div>
          <em>Drop here!</em>
        </div>
      ) : (
        <div>
          <em>Drop gexf file here...</em>
        </div>
      )}
    </div>
  );
}
