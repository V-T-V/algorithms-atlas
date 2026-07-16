import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lisCount } from '../../src/algorithms/dp/dp-lis-3/impl.ts';

test('lis-count LeetCode 673 例 1', () => {
  assert.deepEqual(lisCount([1, 3, 5, 4, 7]), { maxLen: 4, count: 2 });
});

test('lis-count LeetCode 673 例 2', () => {
  assert.deepEqual(lisCount([2, 2, 2, 2, 2]), { maxLen: 1, count: 5 });
});

test('lis-count 单调上升', () => {
  assert.deepEqual(lisCount([1, 2, 3, 4]), { maxLen: 4, count: 1 });
});

test('lis-count 空数组', () => {
  assert.deepEqual(lisCount([]), { maxLen: 0, count: 0 });
});

test('lis-count 单元素', () => {
  assert.deepEqual(lisCount([5]), { maxLen: 1, count: 1 });
});
