import { test } from 'node:test';
import assert from 'node:assert/strict';
import { topologicalSort } from '../../src/algorithms/network/net-topo-sort-kahn/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-topo-sort-kahn/trace.ts';
test('topologicalSort 正确', () => {
  const r = topologicalSort({
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'C', to: 'D' },
    ],
  });
  assert.equal(r.order[0], 'A');
  assert.equal(r.order[3], 'D');
  assert.equal(r.hasCycle, false);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
