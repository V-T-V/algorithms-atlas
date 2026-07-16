import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyColor } from '../../src/algorithms/network/net-color-sort-graph/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-color-sort-graph/trace.ts';
test('greedyColor 正确', () => {
  const c = greedyColor({
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'C' },
    ],
  });
  assert.notEqual(c.get('A'), c.get('B'));
  assert.notEqual(c.get('B'), c.get('C'));
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
