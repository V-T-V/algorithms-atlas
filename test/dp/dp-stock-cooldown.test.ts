import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxProfitCooldown } from '../../src/algorithms/dp/dp-stock-cooldown/impl.ts';

test('stock-cooldown LeetCode 309 例 1', () => {
  assert.equal(maxProfitCooldown([1, 2, 3, 0, 2]), 3);
});

test('stock-cooldown 单调递增', () => {
  assert.equal(maxProfitCooldown([1, 2, 3, 4]), 3);
});

test('stock-cooldown 单调递减', () => {
  assert.equal(maxProfitCooldown([4, 3, 2, 1]), 0);
});

test('stock-cooldown 单日', () => {
  assert.equal(maxProfitCooldown([5]), 0);
});

test('stock-cooldown 空', () => {
  assert.equal(maxProfitCooldown([]), 0);
});
