import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stockCooldown } from '../../src/algorithms/dp/dp-stock-5/impl.ts';

test('stock-cooldown LeetCode 309 例', () => {
  // [1,2,3,0,2] => 买1卖2(cooldown day3) 买0... 实际 transactions: buy1 sell2, buy0 sell2 => 3
  assert.equal(stockCooldown([1, 2, 3, 0, 2]), 3);
});

test('stock-cooldown 单调上升', () => {
  assert.equal(stockCooldown([1, 2, 3, 4]), 3);
});

test('stock-cooldown 单调下降', () => {
  assert.equal(stockCooldown([4, 3, 2, 1]), 0);
});

test('stock-cooldown 空数组', () => {
  assert.equal(stockCooldown([]), 0);
});

test('stock-cooldown 单日', () => {
  assert.equal(stockCooldown([5]), 0);
});
