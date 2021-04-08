import assert from 'assert';
import Graph from 'graphology';
import {loadGexfResource} from './test-utils';
import straighten from '../lib/straighten';
import toSimple from 'graphology-operators/to-simple';

const ARCTIC = loadGexfResource('arctic');
const RIO = loadGexfResource('rio');
const BASIC = loadGexfResource('basic');
const MISERABLES = loadGexfResource('les-miserables');

describe('straighten', function () {
  it('should return nothing if graph is null.', function () {
    const graph = new Graph();

    const model = straighten(graph);

    assert.deepStrictEqual(model, {
      weighted: false,
      nodes: {},
      edges: {},
      defaultNodeSize: null,
      defaultNodeColor: null,
      defaultNodeLabel: null,
      defaultEdgeColor: null,
      defaultEdgeSize: null
    });
  });

  it('should return the correct model with basic.', function () {
    const graph = BASIC.copy();

    const model = straighten(graph);

    assert.strictEqual(model.defaultNodeColor, 'color');
    assert.strictEqual(model.defaultNodeSize, 'size');
    assert.strictEqual(model.defaultNodeLabel, 'label');

    assert.strictEqual(model.defaultEdgeSize, 'thickness');

    assert.deepStrictEqual(model.nodes.size, {
      count: 2,
      type: 'number',
      integer: true,
      kind: 'wellKnown',
      min: 34,
      max: 103,
      name: 'size'
    });

    assert.deepStrictEqual(model.nodes.male, {
      name: 'male',
      kind: 'own',
      count: 2,
      type: 'boolean',
      cardinality: 2,
      top: [
        [true, 1],
        [false, 1]
      ],
      palette: {true: '#b68f2b', false: '#01a8e5'}
    });
  });

  it('should return the correct model with arctic.', function () {
    const graph = toSimple(ARCTIC);

    const model = straighten(graph);

    assert.deepStrictEqual(model.nodes, {
      label: {name: 'label', kind: 'wellKnown', count: 1715, type: 'key'},
      nodedef: {name: 'nodedef', kind: 'own', count: 1715, type: 'key'},
      occurrences: {
        name: 'occurrences',
        kind: 'own',
        count: 1694,
        type: 'number',
        integer: true,
        max: 209,
        min: 1
      },
      color: {name: 'color', kind: 'wellKnown', count: 1715, type: 'key'},
      size: {
        name: 'size',
        kind: 'wellKnown',
        count: 1715,
        type: 'number',
        integer: false,
        max: 14,
        min: 3.6
      },
      x: {
        name: 'x',
        kind: 'wellKnown',
        count: 1715,
        type: 'number',
        integer: false,
        max: 336.5227,
        min: -417.67944
      },
      y: {
        name: 'y',
        kind: 'wellKnown',
        count: 1715,
        type: 'number',
        integer: false,
        max: 377.86423,
        min: -283.31226
      },
      z: {
        name: 'z',
        kind: 'own',
        type: 'constant',
        count: 1715,
        value: 0
      },
      'nansi-louvain': {
        name: 'nansi-louvain',
        kind: 'computed',
        count: 1715,
        type: 'category',
        cardinality: 23,
        top: [
          [7, 291],
          [3, 213],
          [8, 202],
          [5, 135],
          [11, 133],
          [0, 119],
          [4, 101],
          [6, 101],
          [1, 97],
          [10, 68],
          [16, 66],
          [13, 65],
          [12, 39],
          [15, 38],
          [14, 25]
        ],
        palette: {
          '0': '#e49c4b',
          '1': '#c27dae',
          '3': '#ffb5fa',
          '4': '#86e997',
          '5': '#5196f7',
          '6': '#63c1ff',
          '7': '#00c697',
          '8': '#61af58',
          '10': '#34fdfe',
          '11': '#bccc60',
          '12': '#9c89c8',
          '13': '#ff9983',
          '14': '#00c5bc',
          '15': '#a2935d',
          '16': '#d37794'
        }
      },
      // 'nansi-betweenness': {
      //   name: 'nansi-betweenness',
      //   kind: 'computed',
      //   type: 'number',
      //   integer: false,
      //   count: 1715,
      //   max: 0.216792832820432,
      //   min: 0
      // },
      'nansi-degree': {
        count: 1715,
        kind: 'computed',
        integer: true,
        max: 212,
        min: 1,
        name: 'nansi-degree',
        type: 'number'
      }
    });
  });

  it('should return the correct model with rio.', function () {
    const graph = RIO.copy();

    const model = straighten(graph);

    assert.deepStrictEqual(model.nodes, {
      label: {name: 'label', kind: 'wellKnown', type: 'key', count: 366},
      Label2: {name: 'Label2', kind: 'own', type: 'key', count: 366},
      'Nature of institution': {
        name: 'Nature of institution',
        kind: 'own',
        type: 'category',
        count: 366,
        cardinality: 11,
        top: [
          ['NGO', 171],
          ['Trans-institutional', 42],
          ['Individual', 32],
          ['Educational', 25],
          ['Social Movement', 23],
          ['Event', 22],
          ['Media', 20],
          ['Governmental', 15],
          ['Business', 9],
          ['Religious', 6],
          ['Politic', 1]
        ],
        palette: {
          NGO: '#a7915b',
          'Trans-institutional': '#5493f1',
          Individual: '#f7d56c',
          Educational: '#879c32',
          'Social Movement': '#fcabff',
          Event: '#baf4aa',
          Media: '#00ab8d',
          Governmental: '#01aadc',
          Business: '#ff95c0',
          Religious: '#ffd099',
          Politic: '#ff9080'
        }
      },
      Category: {
        name: 'Category',
        kind: 'own',
        type: 'category',
        count: 366,
        cardinality: 5,
        top: [
          ['Social Ecology', 134],
          ['Green-economy', 120],
          ['Deep Ecology', 85],
          ['New Ecologism', 20],
          ['Others', 7]
        ],
        palette: {
          'Social Ecology': '#00b1df',
          'Green-economy': '#f16b7c',
          'Deep Ecology': '#1aeec8',
          'New Ecologism': '#c295f7',
          Others: '#92a339'
        }
      },
      'Latest Six Posts Frequency': {
        name: 'Latest Six Posts Frequency',
        kind: 'own',
        type: 'category',
        count: 366,
        cardinality: 2,
        top: [
          ['Undefined', 223],
          ['Dially', 143]
        ],
        palette: {Undefined: '#5a94f5', Dially: '#e9b455'}
      },
      Language: {
        name: 'Language',
        kind: 'own',
        type: 'category',
        count: 366,
        cardinality: 5,
        top: [
          ['English', 153],
          ['Portuguese', 120],
          ['All', 63],
          ['Spanish', 18],
          ['French', 12]
        ],
        palette: {
          English: '#f97cbb',
          Portuguese: '#89facd',
          All: '#9ca236',
          Spanish: '#699bfd',
          French: '#ffa883'
        }
      },
      'Information Resources': {
        name: 'Information Resources',
        kind: 'own',
        type: 'category',
        count: 366,
        cardinality: 4,
        top: [
          ['Multimedia', 346],
          ['No', 16],
          ['Multi-Wiki', 3],
          ['Multiwiki', 1]
        ],
        palette: {
          Multimedia: '#ecb7ff',
          No: '#a8e07c',
          'Multi-Wiki': '#fd866a',
          Multiwiki: '#02bade'
        }
      },
      color: {name: 'color', kind: 'wellKnown', type: 'key', count: 366},
      size: {
        name: 'size',
        kind: 'wellKnown',
        type: 'number',
        count: 366,
        min: 1,
        max: 20,
        integer: false
      },
      x: {
        name: 'x',
        kind: 'wellKnown',
        type: 'number',
        count: 366,
        min: -909.34393,
        max: 832.9185,
        integer: false
      },
      y: {
        name: 'y',
        kind: 'wellKnown',
        type: 'number',
        count: 366,
        min: -786.7876,
        max: 568.7327,
        integer: false
      },
      z: {name: 'z', kind: 'own', type: 'constant', count: 366, value: 0},
      'nansi-louvain': {
        name: 'nansi-louvain',
        kind: 'computed',
        type: 'category',
        count: 366,
        cardinality: 19,
        top: [
          [0, 90],
          [6, 56],
          [3, 49],
          [4, 48],
          [5, 43],
          [2, 19],
          [8, 12],
          [1, 9],
          [9, 7],
          [10, 6],
          [7, 6],
          [15, 4],
          [14, 4],
          [13, 3],
          [12, 3]
        ],
        palette: {
          '0': '#00c697',
          '1': '#63c1ff',
          '2': '#e49c4b',
          '3': '#61af58',
          '4': '#5196f7',
          '5': '#bccc60',
          '6': '#ffb5fa',
          '7': '#d37794',
          '8': '#86e997',
          '9': '#c27dae',
          '10': '#34fdfe',
          '12': '#00c5bc',
          '13': '#a2935d',
          '14': '#9c89c8',
          '15': '#ff9983'
        }
      },
      'nansi-degree': {
        name: 'nansi-degree',
        kind: 'computed',
        type: 'number',
        count: 366,
        min: 0,
        max: 60,
        integer: true
      },
      'nansi-indegree': {
        name: 'nansi-indegree',
        kind: 'computed',
        type: 'number',
        count: 366,
        min: 0,
        max: 48,
        integer: true
      },
      'nansi-outdegree': {
        name: 'nansi-outdegree',
        kind: 'computed',
        type: 'number',
        count: 366,
        min: 0,
        max: 47,
        integer: true
      }
    });
  });

  it('should return weighted edges if possible.', function () {
    const graph = MISERABLES.copy();

    const model = straighten(graph);

    assert.strictEqual(model.defaultEdgeSize, 'weight');
    assert.strictEqual(model.weighted, true);

    assert.deepStrictEqual(model.nodes['nansi-weighted-degree'], {
      name: 'nansi-weighted-degree',
      kind: 'computed',
      type: 'number',
      count: 77,
      min: 0,
      max: 144,
      integer: true
    });

    assert.deepStrictEqual(model.edges, {
      weight: {
        name: 'weight',
        kind: 'wellKnown',
        type: 'number',
        count: 157,
        min: 2,
        max: 31,
        integer: true
      }
    });
  });
});
