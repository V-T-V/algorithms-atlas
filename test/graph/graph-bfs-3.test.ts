import { test } from 'node:test';
import assert from 'node:assert/strict';
import { layeredBfs, type GraphInput3 } from '../../src/algorithms/graph/graph-bfs-3/impl.ts';

const g: GraphInput3 = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'D', to: 'E' },
  ],
};

test('layered-bfs 顺序与距离', () => {
  const r = layeredBfs(g, 'A');
  assert.deepEqual(r.order, ['A', 'B', 'C', 'D', 'E']);
  assert.equal(r.dist.get('A'), 0);
  assert.equal(r.dist.get('D'), 2);
  assert.equal(r.dist.get('E'), 3);
});

test('layered-bfs 孤立点不可达', () => {
  const r = layeredBfs({ nodes: ['A', 'Z'], edges: [] }, 'A');
  assert.ok(!r.dist.has('Z'));
});

test('layered-bfs 单点', () => {
  const r = layeredBfs({ nodes: ['A'], edges: [] }, 'A');
  assert.deepEqual(r.order, ['A']);
});
