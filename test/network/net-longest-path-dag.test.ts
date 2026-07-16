import { test } from 'node:test';
import assert from 'node:assert/strict';
import { longestPathDAG } from '../../src/algorithms/network/net-longest-path-dag/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-longest-path-dag/trace.ts';
test('longestPathDAG 正确', () => {
  assert.equal(
    longestPathDAG({
      nodes: ['A', 'B', 'C', 'D', 'E'],
      edges: [
        { from: 'A', to: 'B', weight: 3 },
        { from: 'A', to: 'C', weight: 2 },
        { from: 'B', to: 'D', weight: 2 },
        { from: 'C', to: 'D', weight: 1 },
        { from: 'D', to: 'E', weight: 1 },
      ],
    }),
    6,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
