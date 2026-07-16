import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyCoinDenom } from '../../src/algorithms/greedy/greedy-coin-denom/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-coin-denom/trace.ts';
test('美元系统 canonical', () => {
  assert.equal(greedyCoinDenom([1, 5, 10, 25], 50), true);
});
test('非 canonical 系统', () => {
  assert.equal(greedyCoinDenom([1, 3, 4], 6), false);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
