import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dijkstra } from '../../src/algorithms/network/net-dijkstra/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-dijkstra/trace.ts';
const G = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'C', to: 'B', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 8 },
    { from: 'D', to: 'E', weight: 2 },
  ],
};
test('dijkstra 正确', () => {
  const d = dijkstra(G, 'A');
  assert.equal(d.get('A'), 0);
  assert.equal(d.get('B'), 3);
  assert.equal(d.get('E'), 10);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
