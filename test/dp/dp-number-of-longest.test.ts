import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findNumberOfLIS } from '../../src/algorithms/dp/dp-number-of-longest/impl.ts';

test('number-of-longest LeetCode 673 例 1', () => {
  assert.equal(findNumberOfLIS([1, 3, 5, 4, 7]), 2);
});

test('number-of-longest LeetCode 673 例 2', () => {
  assert.equal(findNumberOfLIS([2, 2, 2, 2, 2]), 5);
});

test('number-of-longest 单调递增', () => {
  assert.equal(findNumberOfLIS([1, 2, 3, 4]), 1);
});

test('number-of-longest 单元素', () => {
  assert.equal(findNumberOfLIS([7]), 1);
});

test('number-of-longest 空', () => {
  assert.equal(findNumberOfLIS([]), 0);
});
