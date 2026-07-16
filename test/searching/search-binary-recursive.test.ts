import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binarySearchRecursive } from '../../src/algorithms/searching/search-binary-recursive/impl.ts';

test('找到存在的元素', () => {
  const arr = [1, 3, 5, 7, 9, 11, 13];
  assert.equal(binarySearchRecursive(arr, 7), 3);
  assert.equal(binarySearchRecursive(arr, 1), 0);
  assert.equal(binarySearchRecursive(arr, 13), 6);
});

test('不存在返回 -1', () => {
  const arr = [1, 3, 5, 7, 9];
  assert.equal(binarySearchRecursive(arr, 4), -1);
  assert.equal(binarySearchRecursive(arr, 0), -1);
  assert.equal(binarySearchRecursive(arr, 10), -1);
});

test('空数组', () => {
  assert.equal(binarySearchRecursive([], 5), -1);
});

test('单元素', () => {
  assert.equal(binarySearchRecursive([5], 5), 0);
  assert.equal(binarySearchRecursive([5], 3), -1);
});

test('偶数长度', () => {
  const arr = [2, 4, 6, 8];
  assert.equal(binarySearchRecursive(arr, 6), 2);
  assert.equal(binarySearchRecursive(arr, 8), 3);
});

test('回调触发', () => {
  let calls = 0;
  binarySearchRecursive([1, 2, 3, 4, 5], 3, { onCompare: () => calls++ });
  assert.ok(calls >= 1);
});
