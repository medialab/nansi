import React from 'react';
import cls from 'classnames';

import {exportGraph} from '../../lib/export';
import {useGraph} from '../../hooks';

import './ExportModal.scss';

type ExportModalProps = {
  isOpen: boolean;
  close: () => void;
};

export default function ExportModal({isOpen, close}: ExportModalProps) {
  const graph = useGraph();

  function exportGexf() {
    exportGraph(graph, {name: 'graph.gexf', format: 'gexf'});
  }

  return (
    <div id="ExportModal" className={cls('modal', isOpen && 'is-active')}>
      <div className="modal-background" onClick={close} />
      <div className="modal-content">
        <div className="export-modal-box">
          <h2>Export</h2>
          <div className="columns">
            <div className="column is-4">
              <button className="button" onClick={exportGexf}>
                As a gexf file
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
