import assert from 'assert';
import Graph from 'graphology';
import {exportLayout, applyLayout} from '../lib/utils';

describe('utils', function () {
  describe('#.exportLayout', function () {
    it('should export layout correctly.', function () {
      const graph = new Graph();

      graph.addNode('John', {x: 23, y: 45});
      graph.addNode('Mary', {x: -4, y: 7.6});

      const layout = exportLayout(graph);

      assert.deepStrictEqual(layout, new Float64Array([23, 45, -4, 7.6]));
    });
  });

  describe('#.applyLayout', function () {
    it('should apply given layout correctly', function () {
      const graph = new Graph();

      graph.addNode('John');
      graph.addNode('Mary');

      applyLayout(graph, new Float64Array([23, 45, -4, 7.6]));

      assert.deepStrictEqual(graph.getNodeAttributes('John'), {x: 23, y: 45});
      assert.deepStrictEqual(graph.getNodeAttributes('Mary'), {x: -4, y: 7.6});
    });
  });
});
