import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyMatching } from '../../src/algorithms/network/net-bipartite-match-greedy/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-bipartite-match-greedy/trace.ts';
test('greedyMatching >= 某值', () => {
  const sz = greedyMatching({
    left: ['L1', 'L2', 'L3'],
    right: ['R1', 'R2', 'R3'],
    edges: [
      { from: 'L1', to: 'R1' },
      { from: 'L1', to: 'R2' },
      { from: 'L2', to: 'R1' },
      { from: 'L2', to: 'R3' },
      { from: 'L3', to: 'R2' },
    ],
  });
  assert.ok(sz >= 2);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
