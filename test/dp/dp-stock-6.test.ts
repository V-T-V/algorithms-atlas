import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxProfitFee } from '../../src/algorithms/dp/dp-stock-6/impl.ts';

test('stock-fee LC714 例1', () => {
  assert.equal(maxProfitFee([1, 3, 2, 8, 4, 9], 2), 8);
});

test('stock-fee LC714 例2', () => {
  assert.equal(maxProfitFee([1, 3, 7, 5, 10, 3], 3), 6);
});

test('stock-fee 单日', () => {
  assert.equal(maxProfitFee([5], 1), 0);
});
