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

    assert.deepStrictEqual(JSON.parse(JSON.stringify(model.nodes)), {
      label: {
        type: 'key',
        name: 'label',
        kind: 'wellKnown',
        count: 1715
      },
      nodedef: {
        type: 'key',
        name: 'nodedef',
        kind: 'own',
        count: 1715
      },
      occurrences: {
        type: 'number',
        name: 'occurrences',
        kind: 'own',
        count: 1694,
        max: 209,
        min: 1
      },
      color: {
        type: 'key',
        name: 'color',
        kind: 'wellKnown',
        count: 1715
      },
      size: {
        type: 'number',
        name: 'size',
        kind: 'wellKnown',
        count: 1715,
        max: 14,
        min: 3.6
      },
      x: {
        type: 'number',
        name: 'x',
        kind: 'wellKnown',
        count: 1715,
        max: 336.5227,
        min: -417.67944
      },
      y: {
        type: 'number',
        name: 'y',
        kind: 'wellKnown',
        count: 1715,
        max: 377.86423,
        min: -283.31226
      },
      z: {
        type: 'number',
        name: 'z',
        kind: 'own',
        count: 1715,
        max: 0,
        min: 0
      }
    });
  });

  it('should return the correct model with rio.', function () {
    const graph = RIO.copy();

    const model = straighten(graph);

    assert.deepStrictEqual(JSON.parse(JSON.stringify(model.nodes)), {
      label: {
        name: 'label',
        kind: 'wellKnown',
        count: 366,
        type: 'key'
      },
      Label2: {
        name: 'Label2',
        kind: 'own',
        count: 366,
        type: 'key'
      },
      'Nature of institution:': {
        name: 'Nature of institution:',
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
      },
      indegree: {
        name: 'indegree',
        kind: 'own',
        count: 366,
        type: 'number',
        max: 51,
        min: 0
      },
      outdegree: {
        name: 'outdegree',
        kind: 'own',
        count: 366,
        type: 'number',
        max: 47,
        min: 0
      },
      degree: {
        name: 'degree',
        kind: 'own',
        count: 366,
        type: 'number',
        max: 60,
        min: 2
      },
      color: {
        name: 'color',
        kind: 'wellKnown',
        count: 366,
        type: 'key'
      },
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
        type: 'number',
        max: 0,
        min: 0
      }
    });
  });
});
