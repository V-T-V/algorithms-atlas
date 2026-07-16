import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitArrayLargest } from '../../src/algorithms/dp/dp-split-array-largest/impl.ts';

test('split-array LeetCode 410 例', () => {
  assert.equal(splitArrayLargest([7, 2, 5, 10, 8], 2), 18);
});

test('split-array 每个一段', () => {
  assert.equal(splitArrayLargest([1, 2, 3, 4], 4), 4);
});

test('split-array 一段', () => {
  assert.equal(splitArrayLargest([1, 2, 3], 1), 6);
});

test('split-array 单元素', () => {
  assert.equal(splitArrayLargest([5], 1), 5);
});

test('split-array 等分', () => {
  assert.equal(splitArrayLargest([1, 1, 1, 1], 2), 2);
});
