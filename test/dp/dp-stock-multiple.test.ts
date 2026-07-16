import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxProfitMultiple } from '../../src/algorithms/dp/dp-stock-multiple/impl.ts';

test('stock-multiple LeetCode 122 例 1', () => {
  assert.equal(maxProfitMultiple([7, 1, 5, 3, 6, 4]), 7);
});

test('stock-multiple LeetCode 122 例 2', () => {
  assert.equal(maxProfitMultiple([1, 2, 3, 4, 5]), 4);
});

test('stock-multiple 单调递减', () => {
  assert.equal(maxProfitMultiple([7, 6, 4, 3, 1]), 0);
});

test('stock-multiple 单日', () => {
  assert.equal(maxProfitMultiple([5]), 0);
});

test('stock-multiple 空', () => {
  assert.equal(maxProfitMultiple([]), 0);
});
