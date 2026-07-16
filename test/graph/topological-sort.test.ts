import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  topologicalSort,
  topologicalSortDfs,
  type GraphInput,
} from '../../src/algorithms/graph/topological-sort/impl.ts';

test('topological-sort 基本行为', () => {
  const graph: GraphInput = {
    nodes: ['a', 'b', 'c', 'd'],
    edges: [
      { from: 'a', to: 'c' },
      { from: 'b', to: 'c' },
      { from: 'c', to: 'd' },
    ],
  };
  const result = topologicalSort(graph);

  assert.equal(result.isDag, true);
  assert.deepEqual(result.order, ['a', 'b', 'c', 'd']);
  assert.deepEqual(topologicalSort({ nodes: [], edges: [] }).order, []);
  assert.deepEqual(topologicalSort({ nodes: ['x'], edges: [] }).order, ['x']);
});

test('topological-sort 检测环', () => {
  const result = topologicalSort({
    nodes: ['a', 'b', 'c'],
    edges: [
      { from: 'a', to: 'b' },
      { from: 'b', to: 'c' },
      { from: 'c', to: 'a' },
    ],
  });

  assert.equal(result.isDag, false);
  assert.equal(result.order.length, 0);
});

test('topological-sort dfs 版本返回合法拓扑序', () => {
  assert.deepEqual(
    topologicalSortDfs({
      nodes: ['a', 'b', 'c'],
      edges: [
        { from: 'a', to: 'c' },
        { from: 'b', to: 'c' },
      ],
    }).order,
    ['b', 'a', 'c'],
  );
});
