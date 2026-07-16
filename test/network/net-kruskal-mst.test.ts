import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kruskalMST } from '../../src/algorithms/network/net-kruskal-mst/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-kruskal-mst/trace.ts';
test('kruskalMST 正确', () => {
  assert.equal(
    kruskalMST({
      nodes: ['A', 'B', 'C', 'D'],
      edges: [
        { from: 'A', to: 'B', weight: 1 },
        { from: 'A', to: 'C', weight: 5 },
        { from: 'B', to: 'C', weight: 2 },
        { from: 'B', to: 'D', weight: 4 },
        { from: 'C', to: 'D', weight: 3 },
      ],
    }),
    6,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
