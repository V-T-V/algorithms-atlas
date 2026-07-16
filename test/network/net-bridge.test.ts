import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findBridges } from '../../src/algorithms/network/net-bridge/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-bridge/trace.ts';
test('findBridges 正确', () => {
  const bs = findBridges({
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
    ],
  });
  assert.equal(bs.length, 3);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
