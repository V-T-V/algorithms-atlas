import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxProfitFee } from '../../src/algorithms/dp/dp-stock-8/impl.ts';

test('stock fee 经典', () => {
  assert.equal(maxProfitFee([1, 3, 2, 8, 4, 9], 2), 8);
});
test('stock fee 单调', () => {
  assert.equal(maxProfitFee([1, 2, 3, 4], 1), 2);
});
test('stock fee 空', () => {
  assert.equal(maxProfitFee([], 1), 0);
});
