import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxProduct } from '../../src/algorithms/dp/dp-maxprod-3/impl.ts';

test('prod 经典', () => {
  assert.equal(maxProduct([2, 3, -2, 4]), 6);
});
test('prod 含两个负数', () => {
  assert.equal(maxProduct([-2, 3, -4]), 24);
});
test('prod 空', () => {
  assert.equal(maxProduct([]), 0);
});
test('prod 全负', () => {
  assert.equal(maxProduct([-2, -3, -1]), 6);
});
