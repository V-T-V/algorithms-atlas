import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canMeasureWater } from '../../src/algorithms/network/net-water-pour/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-water-pour/trace.ts';
test('canMeasureWater 正确', () => {
  assert.equal(canMeasureWater(3, 5, 4), true);
  assert.equal(canMeasureWater(2, 6, 5), false);
  assert.equal(canMeasureWater(1, 2, 3), true);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
