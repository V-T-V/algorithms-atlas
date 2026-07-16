import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxProfitCooldown } from '../../src/algorithms/dp/dp-stock-9/impl.ts';

test('cooldown 经典', () => {
  assert.equal(maxProfitCooldown([1, 2, 3, 0, 2]), 3);
});
test('cooldown 单调', () => {
  assert.equal(maxProfitCooldown([1, 2, 3, 4]), 3);
});
test('cooldown 空', () => {
  assert.equal(maxProfitCooldown([]), 0);
});
