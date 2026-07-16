import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coinChange } from '../../src/algorithms/dp/dp-coin-5/impl.ts';

test('coin 11', () => {
  assert.equal(coinChange([1, 5, 11], 15), 3); // 5+5+5
});
test('coin 无法凑', () => {
  assert.equal(coinChange([2], 3), -1);
});
test('coin 0', () => {
  assert.equal(coinChange([1, 2, 5], 0), 0);
});
test('coin 11/经典', () => {
  assert.equal(coinChange([1, 2, 5], 11), 3);
});
