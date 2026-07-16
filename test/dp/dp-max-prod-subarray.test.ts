import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxProductSubarray } from '../../src/algorithms/dp/dp-max-prod-subarray/impl.ts';

test('max-prod LeetCode 152 例 1', () => {
  assert.equal(maxProductSubarray([2, 3, -2, 4]), 6);
});

test('max-prod LeetCode 152 例 2', () => {
  assert.equal(maxProductSubarray([-2, 0, -1]), 0);
});

test('max-prod 含两个负数', () => {
  assert.equal(maxProductSubarray([-2, 3, -4]), 24);
});

test('max-prod 单元素', () => {
  assert.equal(maxProductSubarray([5]), 5);
  assert.equal(maxProductSubarray([-3]), -3);
});

test('max-prod 空数组', () => {
  assert.equal(maxProductSubarray([]), 0);
});
