import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dfsColor, type GraphInput3Dfs } from '../../src/algorithms/graph/graph-dfs-3/impl.ts';

test('dfs-color 检测有向环', () => {
  const g: GraphInput3Dfs = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'B' },
    ],
    directed: true,
  };
  const r = dfsColor(g, 'A');
  assert.equal(r.hasCycle, true);
});

test('dfs-color DAG 无环', () => {
  const g: GraphInput3Dfs = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
    ],
    directed: true,
  };
  const r = dfsColor(g, 'A');
  assert.equal(r.hasCycle, false);
  assert.deepEqual(r.order, ['A', 'B', 'C']);
});

test('dfs-color 无向图环', () => {
  const g: GraphInput3Dfs = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  const r = dfsColor(g, 'A');
  assert.equal(r.hasCycle, true);
});
