import { test } from 'node:test';
import assert from 'node:assert/strict';
import { floydWarshall } from '../../src/algorithms/network/net-floyd-warshall/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-floyd-warshall/trace.ts';
test('floydWarshall 正确', () => {
  const d = floydWarshall({
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 2 },
      { from: 'A', to: 'C', weight: 8 },
      { from: 'C', to: 'D', weight: 1 },
      { from: 'B', to: 'D', weight: 5 },
    ],
  });
  assert.equal(d[0]![3], 4);
  assert.equal(d[0]![0], 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
