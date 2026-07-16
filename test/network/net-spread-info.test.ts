import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spreadInfo } from '../../src/algorithms/network/net-spread-info/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-spread-info/trace.ts';
test('spreadInfo 正确', () => {
  const d = spreadInfo({
    nodes: ['A', 'B', 'C', 'D', 'E'],
    sources: ['A', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'E' },
    ],
  });
  assert.equal(d.get('A'), 0);
  assert.equal(d.get('B'), 1);
  assert.equal(d.get('E'), 2);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
