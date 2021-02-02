import React, {useCallback} from 'react';
import cx from 'classnames';
import {useDropzone} from 'react-dropzone';

import './FileDrop.scss';

const ACCEPT = '.json,.gexf,.graphml,application/json';

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
    <div className={cx("FileDrop", {'is-dragged-over': isDragActive})} {...getRootProps()}>
      <input {...getInputProps()} accept={ACCEPT} />
        <div className="draggable-placeholder">
          <p>
          <em>
            Drop here a network file to work with, or click on this box to open a dialog box.
            <br />
            We currently accept only <strong>.json</strong>,{' '}
            <strong>.gexf</strong> and <strong>.graphml</strong> files.
          </em>
          </p>
          <p className={cx('drop-prompt', {active: isDragActive})}>
            <strong>Ready to import !</strong>
          </p>
        </div>
    </div>
  );
}
