import { test } from 'node:test';
import assert from 'node:assert/strict';
import { articulationPoints } from '../../src/algorithms/network/net-articulation/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-articulation/trace.ts';
test('articulationPoints 正确', () => {
  const pts = articulationPoints({
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'E' },
    ],
  });
  assert.ok(pts.includes('D'));
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
