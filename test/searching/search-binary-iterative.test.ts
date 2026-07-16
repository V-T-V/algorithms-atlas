import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binarySearchIterative } from '../../src/algorithms/searching/search-binary-iterative/impl.ts';

test('找到存在的元素', () => {
  const arr = [1, 3, 5, 7, 9, 11, 13];
  assert.equal(binarySearchIterative(arr, 7), 3);
  assert.equal(binarySearchIterative(arr, 1), 0);
  assert.equal(binarySearchIterative(arr, 13), 6);
});

test('不存在返回 -1', () => {
  const arr = [1, 3, 5, 7, 9];
  assert.equal(binarySearchIterative(arr, 4), -1);
  assert.equal(binarySearchIterative(arr, 0), -1);
  assert.equal(binarySearchIterative(arr, 10), -1);
});

test('空数组', () => {
  assert.equal(binarySearchIterative([], 5), -1);
});

test('单元素', () => {
  assert.equal(binarySearchIterative([5], 5), 0);
  assert.equal(binarySearchIterative([5], 3), -1);
});

test('大数组', () => {
  const arr = Array.from({ length: 1000 }, (_, i) => i * 2);
  assert.equal(binarySearchIterative(arr, 500), 250);
  assert.equal(binarySearchIterative(arr, 501), -1);
});
