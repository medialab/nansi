import {saveAs} from 'file-saver';

type SaveType = 'application/xml' | 'application/json';

export function saveText(name: string, text: string, type: SaveType) {
  const blob = new Blob([text], {type: `${type};charset=utf-8`});

  saveAs(blob, name);
}
