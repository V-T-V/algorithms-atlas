import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMaximumNumber } from '../../src/algorithms/dp/dp-create-maximum-2/impl.ts';

test('max-number LeetCode 321 例 1', () => {
  assert.deepEqual(createMaximumNumber([3, 4, 6, 5], [9, 1, 2, 5, 8, 3], 5), [9, 8, 6, 5, 3]);
});

test('max-number LeetCode 321 例 2', () => {
  assert.deepEqual(createMaximumNumber([6, 7], [6, 0, 4], 5), [6, 7, 6, 0, 4]);
});

test('max-number LeetCode 321 例 3', () => {
  assert.deepEqual(createMaximumNumber([3, 9], [8, 9], 3), [9, 8, 9]);
});

test('max-number 全取自一数组', () => {
  assert.deepEqual(createMaximumNumber([1, 2, 3], [], 3), [1, 2, 3]);
});

test('max-number k=1', () => {
  assert.deepEqual(createMaximumNumber([1], [2], 1), [2]);
});
