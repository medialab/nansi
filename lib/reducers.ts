import {scaleLinear} from 'd3-scale';

import {isNumber} from './utils';
// import {
//   SerializedGraphModelAttribute,
//   SerializedGraphModelCategoryAttribute,
//   SerializedGraphModelNumberAttribute
// } from './straighten';

/**
 * Nodes.
 */
export type RenderedNode = {
  x: number;
  y: number;
  label?: string;
  size?: number;
  color?: string;
};

// TODO: we can do better than any...
export type CreateNodeReducerOptions = {
  nodeColor?: any;
  nodeSize?: any;
  nodeLabel?: any;
  scalingFactor?: number;
};

// Defaults
const DEFAULT_NODE_COLOR = '#999';
const DEFAULT_NODE_SIZE_RANGE = [2, 15];

export function createNodeReducer({
  nodeColor,
  nodeSize,
  nodeLabel,
  scalingFactor = 1
}: CreateNodeReducerOptions) {
  let nodeSizeScale = null;

  // Creating scales
  if (nodeSize) {
    nodeSizeScale = scaleLinear()
      .domain([nodeSize.min, nodeSize.max])
      .range(DEFAULT_NODE_SIZE_RANGE);

    if (nodeSize.min === nodeSize.max) nodeSizeScale = () => 3;
  }

  // Creating actual reducer
  const nodeReducer = function (key, attr): RenderedNode {
    const renderedNode: RenderedNode = {
      x: attr.x,
      y: attr.y
    };

    // Color
    if (!nodeColor) {
      renderedNode.color = DEFAULT_NODE_COLOR;
    } else {
      if (nodeColor.palette) {
        renderedNode.color =
          nodeColor.palette[attr[nodeColor.name]] || DEFAULT_NODE_COLOR;
      } else {
        renderedNode.color = attr[nodeColor.name] || DEFAULT_NODE_COLOR;
      }
    }

    // Size
    if (!nodeSize) {
      renderedNode.size = DEFAULT_NODE_SIZE_RANGE[0];
    } else {
      let v = attr[nodeSize.name];
      v = isNumber(v) ? v : nodeSize.min;
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

/**
 * Edges.
 */
export type RenderedEdge = {
  color?: string;
  size?: number;
};

export type CreateEdgeReducerOptions = {
  edgeSize?: any;
  edgeColor?: any;
  scalingFactor?: number;
};

// Defaults
const DEFAULT_EDGE_COLOR = '#ccc';
const DEFAULT_EDGE_SIZE_RANGE = [1, 10];

export function createEdgeReducer({
  edgeSize,
  edgeColor,
  scalingFactor = 1
}: CreateEdgeReducerOptions) {
  let edgeSizeScale = null;

  // Creating scales
  if (edgeSize) {
    edgeSizeScale = scaleLinear()
      .domain([edgeSize.min, edgeSize.max])
      .range(DEFAULT_EDGE_SIZE_RANGE);
  }

  // Creating actual reducer
  const edgeReducer = function (key, attr): RenderedEdge {
    const renderedEdge: RenderedEdge = {};

    // Color
    if (!edgeColor) {
      renderedEdge.color = DEFAULT_EDGE_COLOR;
    } else {
      if (edgeColor.palette) {
        renderedEdge.color =
          edgeColor.palette[attr[edgeColor.name]] || DEFAULT_NODE_COLOR;
      } else {
        renderedEdge.color = attr[edgeColor.name] || DEFAULT_NODE_COLOR;
      }
    }

    // Size
    if (!edgeSize) {
      renderedEdge.size = DEFAULT_EDGE_SIZE_RANGE[0];
    } else {
      let v = attr[edgeSize.name];
      v = isNumber(v) ? v : edgeSize.min;
      renderedEdge.size = edgeSizeScale(v);
    }

    renderedEdge.size *= scalingFactor;

    return renderedEdge;
  };

  return edgeReducer;
}
