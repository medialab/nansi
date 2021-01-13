import {saveAs} from 'file-saver';

type SaveTextType = 'application/xml' | 'application/json' | 'image/svg+xml';

export function saveText(name: string, text: string, type: SaveTextType) {
  const blob = new Blob([text], {type: `${type};charset=utf-8`});

  saveAs(blob, name);
}

type SaveCanvasType = 'image/png';

export function saveCanvas(
  name: string,
  canvas: HTMLCanvasElement,
  type: SaveCanvasType = 'image/png'
) {
  canvas.toBlob(blob => {
    saveAs(blob, name);
  }, type);
}
