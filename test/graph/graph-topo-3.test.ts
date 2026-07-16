import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  topologicalSort,
  type DagGraphInput,
} from '../../src/algorithms/graph/graph-topo-3/impl.ts';

test('topo 基本', () => {
  const g: DagGraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'C', to: 'D' },
    ],
  };
  const r = topologicalSort(g);
  assert.equal(r.hasCycle, false);
  assert.equal(r.order[0], 'A');
  assert.equal(r.order[r.order.length - 1], 'D');
});

test('topo 检测环', () => {
  const g: DagGraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  assert.equal(topologicalSort(g).hasCycle, true);
});
