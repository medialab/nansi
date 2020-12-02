import assert from 'assert';
import {loadGexfResource} from './utils';
import straighten from '../lib/straighten';
import toSimple from 'graphology-operators/to-simple';

const ARCTIC = loadGexfResource('arctic');
const RIO = loadGexfResource('rio');

describe('straighten', function () {
  it('should return the correct model with arctic.', function () {
    const graph = toSimple(ARCTIC);

    const model = straighten(graph);

    assert.deepStrictEqual(model.extents, {
      nodeSize: {
        min: 3.6,
        max: 14
      }
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(model.nodes)), {
      label: {name: 'label', kind: 'wellKnown', count: 1715, type: 'key'},
      nodedef: {name: 'nodedef', kind: 'own', count: 1715, type: 'key'},
      occurrences: {
        name: 'occurrences',
        kind: 'own',
        count: 1694,
        type: 'number',
        max: 209,
        min: 1
      },
      color: {name: 'color', kind: 'wellKnown', count: 1715, type: 'key'},
      size: {
        name: 'size',
        kind: 'wellKnown',
        count: 1715,
        type: 'number',
        max: 14,
        min: 3.6
      },
      x: {
        name: 'x',
        kind: 'wellKnown',
        count: 1715,
        type: 'number',
        max: 336.5227,
        min: -417.67944
      },
      y: {
        name: 'y',
        kind: 'wellKnown',
        count: 1715,
        type: 'number',
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
        cardinality: 22,
        top: [
          [7, 291],
          [3, 213],
          [8, 202],
          [5, 123],
          [0, 119],
          [4, 101],
          [6, 101],
          [11, 96],
          [14, 73],
          [10, 68],
          [16, 66],
          [13, 65],
          [1, 61],
          [2, 46],
          [12, 39]
        ],
        palette: {
          '0': '#bccc60',
          '1': '#9c89c8',
          '2': '#a2935d',
          '3': '#ffb5fa',
          '4': '#e49c4b',
          '5': '#5196f7',
          '6': '#86e997',
          '7': '#00c697',
          '8': '#61af58',
          '10': '#34fdfe',
          '11': '#63c1ff',
          '12': '#00c5bc',
          '13': '#ff9983',
          '14': '#c27dae',
          '16': '#d37794'
        }
      },
      'nansi-betweenness': {
        name: 'nansi-betweenness',
        kind: 'computed',
        type: 'number',
        count: 1715,
        max: 0.216792832820432,
        min: 0
      }
    });
  });

  it('should return the correct model with rio.', function () {
    const graph = RIO.copy();

    const model = straighten(graph);

    assert.deepStrictEqual(model.extents, {
      nodeSize: {min: 1, max: 20}
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(model.nodes)), {
      label: {name: 'label', kind: 'wellKnown', count: 366, type: 'key'},
      Label2: {name: 'Label2', kind: 'own', count: 366, type: 'key'},
      'Nature of institution': {
        name: 'Nature of institution',
        kind: 'own',
        count: 366,
        type: 'category',
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
        count: 366,
        type: 'category',
        cardinality: 5,
        top: [
          ['Social Ecology', 134],
          ['Green-economy', 120],
          ['Deep Ecology', 85],
          ['New Ecologism', 20],
          ['Others', 7]
        ],
        palette: {
          'Social Ecology': '#da89e2',
          'Green-economy': '#a3f9ac',
          'Deep Ecology': '#d2d96b',
          'New Ecologism': '#02f1e9',
          Others: '#ffb492'
        }
      },
      'Latest Six Posts Frequency': {
        name: 'Latest Six Posts Frequency',
        kind: 'own',
        count: 366,
        type: 'category',
        cardinality: 2,
        top: [
          ['Undefined', 223],
          ['Dially', 143]
        ],
        palette: {Undefined: '#f09c54', Dially: '#3ff6c9'}
      },
      Language: {
        name: 'Language',
        kind: 'own',
        count: 366,
        type: 'category',
        cardinality: 5,
        top: [
          ['English', 153],
          ['Portuguese', 120],
          ['All', 63],
          ['Spanish', 18],
          ['French', 12]
        ],
        palette: {
          English: '#cfbf53',
          Portuguese: '#00c9ff',
          All: '#ea6b72',
          Spanish: '#7cc164',
          French: '#ab8f5c'
        }
      },
      'Information Resources': {
        name: 'Information Resources',
        kind: 'own',
        count: 366,
        type: 'category',
        cardinality: 4,
        top: [
          ['Multimedia', 346],
          ['No', 16],
          ['Multi-Wiki', 3],
          ['Multiwiki', 1]
        ],
        palette: {
          Multimedia: '#d27b74',
          No: '#00a5f2',
          'Multi-Wiki': '#c1d367',
          Multiwiki: '#ffc0e3'
        }
      },
      color: {name: 'color', kind: 'wellKnown', count: 366, type: 'key'},
      size: {
        name: 'size',
        kind: 'wellKnown',
        count: 366,
        type: 'number',
        max: 20,
        min: 1
      },
      x: {
        name: 'x',
        kind: 'wellKnown',
        count: 366,
        type: 'number',
        max: 832.9185,
        min: -909.34393
      },
      y: {
        name: 'y',
        kind: 'wellKnown',
        count: 366,
        type: 'number',
        max: 568.7327,
        min: -786.7876
      },
      z: {
        name: 'z',
        kind: 'own',
        count: 366,
        type: 'constant',
        value: 0
      },
      'nansi-louvain': {
        name: 'nansi-louvain',
        kind: 'computed',
        count: 366,
        type: 'category',
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
      'nansi-betweenness': {
        name: 'nansi-betweenness',
        kind: 'computed',
        type: 'number',
        count: 366,
        max: 0.022883737267298917,
        min: 0
      }
    });
  });
});
