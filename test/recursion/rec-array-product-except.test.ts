import { test } from 'node:test';
import assert from 'node:assert/strict';
import { productExceptSelf } from '../../src/algorithms/recursion/rec-array-product-except/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-array-product-except/trace.ts';

test('rec-array-product-except 基本用例', () => {
  assert.deepEqual(productExceptSelf([1, 2, 3, 4]), [24, 12, 8, 6]);
});

test('rec-array-product-except 含零', () => {
  assert.deepEqual(productExceptSelf([0, 1, 2]), [2, 0, 0]);
  assert.deepEqual(productExceptSelf([0, 0, 2]), [0, 0, 0]);
});

test('rec-array-product-except 单元素', () => {
  assert.deepEqual(productExceptSelf([5]), [1]);
});

test('rec-array-product-except 含负数', () => {
  assert.deepEqual(productExceptSelf([-1, 2, -3]), [-6, 3, -2]);
});

test('rec-array-product-except trace', () => {
  assert.ok(buildTrace().length > 2);
});
