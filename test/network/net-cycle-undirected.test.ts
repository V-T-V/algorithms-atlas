import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasCycle } from '../../src/algorithms/network/net-cycle-undirected/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-cycle-undirected/trace.ts';
test('hasCycle 正确', () => {
  assert.equal(
    hasCycle({
      nodes: ['A', 'B', 'C'],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'A' },
      ],
    }),
    true,
  );
  assert.equal(
    hasCycle({
      nodes: ['A', 'B', 'C'],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
      ],
    }),
    false,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
