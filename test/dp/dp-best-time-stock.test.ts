import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxProfitOnce } from '../../src/algorithms/dp/dp-best-time-stock/impl.ts';

test('best-time-stock LeetCode 121 例 1', () => {
  assert.equal(maxProfitOnce([7, 1, 5, 3, 6, 4]), 5);
});

test('best-time-stock LeetCode 121 例 2', () => {
  assert.equal(maxProfitOnce([7, 6, 4, 3, 1]), 0);
});

test('best-time-stock 单调递增', () => {
  assert.equal(maxProfitOnce([1, 2, 3, 4, 5]), 4);
});

test('best-time-stock 单日', () => {
  assert.equal(maxProfitOnce([5]), 0);
});

test('best-time-stock 空', () => {
  assert.equal(maxProfitOnce([]), 0);
});
