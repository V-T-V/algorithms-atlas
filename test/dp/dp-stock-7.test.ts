import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxProfitCooldown } from '../../src/algorithms/dp/dp-stock-7/impl.ts';

test('stock-cooldown LC309 例', () => {
  assert.equal(maxProfitCooldown([1, 2, 3, 0, 2]), 3);
});

test('stock-cooldown 上涨', () => {
  assert.equal(maxProfitCooldown([1, 2, 3, 4, 5]), 4);
});

test('stock-cooldown 单日', () => {
  assert.equal(maxProfitCooldown([5]), 0);
});

test('stock-cooldown 空', () => {
  assert.equal(maxProfitCooldown([]), 0);
});
