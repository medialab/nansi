import assert from 'assert';
import {loadGexfResource} from './utils';
import straighten from '../lib/straighten';
import toSimple from 'graphology-operators/to-simple';

const ARCTIC = loadGexfResource('arctic');

describe('straighten', function () {
  it('should return the correct model.', function () {
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
});
