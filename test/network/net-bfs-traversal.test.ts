import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bfs } from '../../src/algorithms/network/net-bfs-traversal/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-bfs-traversal/trace.ts';
const G = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
  ],
};
test('bfs 从 A', () => {
  assert.deepEqual(bfs(G, 'A'), ['A', 'B', 'C', 'D']);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
