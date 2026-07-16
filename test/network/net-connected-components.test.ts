import { test } from 'node:test';
import assert from 'node:assert/strict';
import { connectedComponents } from '../../src/algorithms/network/net-connected-components/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-connected-components/trace.ts';
test('connectedComponents 正确', () => {
  const cs = connectedComponents({
    nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'D', to: 'E' },
    ],
  });
  assert.equal(cs.length, 3);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
