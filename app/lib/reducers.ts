import {scaleLinear} from 'd3-scale';

// TODO: should be provided by sigma?
export type RenderedNode = {
  x: number;
  y: number;
  label?: string;
  size?: number;
  color?: string;
};

export type CreateNodeReducerOptions = {
  nodeColor?: any;
  nodeSize?: any;
  nodeLabel?: any;
  scalingFactor?: number;
  extents: any;
};

// Defaults
const DEFAULT_NODE_COLOR = '#999';
const DEFAULT_NODE_SIZE_RANGE = [2, 15];

export function createNodeReducer({
  nodeColor,
  nodeSize,
  nodeLabel,
  scalingFactor = 1,
  extents
}: CreateNodeReducerOptions) {
  let nodeSizeScale = null;

  // Creating scales
  if (!nodeSize) {
    nodeSizeScale = scaleLinear()
      .domain([extents.nodeSize.min, extents.nodeSize.max])
      .range(DEFAULT_NODE_SIZE_RANGE);
  } else {
    nodeSizeScale = scaleLinear()
      .domain([nodeSize.min, nodeSize.max])
      .range(DEFAULT_NODE_SIZE_RANGE);
  }

  // Creating actual reducer
  const nodeReducer = function (key, attr): RenderedNode {
    const renderedNode: RenderedNode = {
      x: attr.x,
      y: attr.y
    };

    // Color
    if (!nodeColor) {
      renderedNode.color = attr.color || DEFAULT_NODE_COLOR;
    } else {
      renderedNode.color =
        nodeColor.palette[attr[nodeColor.name]] || DEFAULT_NODE_COLOR;
    }

    // Size
    if (!nodeSize) {
      let v = attr.size || 1;
      renderedNode.size = nodeSizeScale(v);
    } else {
      let v = attr[nodeSize.name];
      v = typeof v === 'number' ? v : 1;
      renderedNode.size = nodeSizeScale(v);
    }

    renderedNode.size *= scalingFactor;

    // Label
    if (!nodeLabel) {
      renderedNode.label = attr.label || key;
    } else {
      renderedNode.label = attr[nodeLabel.name] || '<no-label>';
    }

    return renderedNode;
  };

  return nodeReducer;
}
