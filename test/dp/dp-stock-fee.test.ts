import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxProfitWithFee } from '../../src/algorithms/dp/dp-stock-fee/impl.ts';

test('stock-fee LeetCode 714 例 1', () => {
  assert.equal(maxProfitWithFee([1, 3, 2, 8, 4, 9], 2), 8);
});

test('stock-fee LeetCode 714 例 2', () => {
  assert.equal(maxProfitWithFee([1, 3, 7, 5, 10, 3], 3), 6);
});

test('stock-fee 手续费过高', () => {
  assert.equal(maxProfitWithFee([1, 2, 3], 100), 0);
});

test('stock-fee 单日', () => {
  assert.equal(maxProfitWithFee([5], 2), 0);
});

test('stock-fee 空', () => {
  assert.equal(maxProfitWithFee([], 2), 0);
});
