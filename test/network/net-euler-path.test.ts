import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eulerKind } from '../../src/algorithms/network/net-euler-path/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-euler-path/trace.ts';
test('eulerKind 正确', () => {
  assert.equal(
    eulerKind({
      nodes: ['A', 'B', 'C', 'D'],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'D' },
        { from: 'D', to: 'A' },
      ],
    }),
    'circuit',
  );
  assert.equal(
    eulerKind({
      nodes: ['A', 'B', 'C'],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
      ],
    }),
    'path',
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
