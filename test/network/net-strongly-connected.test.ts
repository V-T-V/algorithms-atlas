import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kosaraju } from '../../src/algorithms/network/net-strongly-connected/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-strongly-connected/trace.ts';
test('kosaraju 正确', () => {
  const cs = kosaraju({
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'E' },
      { from: 'E', to: 'D' },
    ],
  });
  assert.equal(cs.length, 2);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
