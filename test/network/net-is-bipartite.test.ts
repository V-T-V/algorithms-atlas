import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isBipartite } from '../../src/algorithms/network/net-is-bipartite/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-is-bipartite/trace.ts';
test('isBipartite 正确', () => {
  assert.equal(
    isBipartite({
      nodes: ['A', 'B', 'C', 'D'],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
        { from: 'B', to: 'D' },
        { from: 'C', to: 'D' },
      ],
    }),
    true,
  );
  assert.equal(
    isBipartite({
      nodes: ['A', 'B', 'C'],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'A' },
      ],
    }),
    false,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
