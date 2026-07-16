import { test } from 'node:test';
import assert from 'node:assert/strict';
import { linearSearchSorted } from '../../src/algorithms/searching/search-linear-sorted/impl.ts';

test('找到存在元素', () => {
  const arr = [1, 3, 5, 7, 9, 11, 13];
  assert.equal(linearSearchSorted(arr, 5), 2);
  assert.equal(linearSearchSorted(arr, 1), 0);
  assert.equal(linearSearchSorted(arr, 13), 6);
});

test('不存在但小于最大值提前停止', () => {
  const arr = [1, 3, 5, 7, 9, 11, 13];
  assert.equal(linearSearchSorted(arr, 6), -1);
  assert.equal(linearSearchSorted(arr, 4), -1);
});

test('大于所有元素返回 -1', () => {
  const arr = [1, 3, 5, 7, 9];
  assert.equal(linearSearchSorted(arr, 100), -1);
});

test('空数组', () => {
  assert.equal(linearSearchSorted([], 5), -1);
});

test('单元素', () => {
  assert.equal(linearSearchSorted([5], 5), 0);
  assert.equal(linearSearchSorted([5], 3), -1);
  assert.equal(linearSearchSorted([5], 7), -1);
});
