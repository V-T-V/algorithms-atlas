import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bellmanFord } from '../../src/algorithms/network/net-bellman-ford/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-bellman-ford/trace.ts';
test('bellmanFord 正确', () => {
  const { dist, negCycle } = bellmanFord(
    {
      nodes: ['A', 'B', 'C', 'D'],
      directed: true,
      edges: [
        { from: 'A', to: 'B', weight: 4 },
        { from: 'A', to: 'C', weight: 5 },
        { from: 'B', to: 'C', weight: -3 },
        { from: 'C', to: 'D', weight: 4 },
      ],
    },
    'A',
  );
  assert.equal(dist.get('C'), 1);
  assert.equal(dist.get('D'), 5);
  assert.equal(negCycle, false);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
