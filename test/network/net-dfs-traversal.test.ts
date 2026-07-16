import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dfs } from '../../src/algorithms/network/net-dfs-traversal/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-dfs-traversal/trace.ts';
const G = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
  ],
};
test('dfs 从 A', () => {
  const o = dfs(G, 'A');
  assert.equal(o[0], 'A');
  assert.equal(o.length, 4);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
