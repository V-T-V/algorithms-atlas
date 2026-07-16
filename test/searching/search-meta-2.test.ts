import { test } from 'node:test';
import assert from 'node:assert/strict';
import { metaBinarySearch } from '../../src/algorithms/searching/search-meta-2/impl.ts';

test('找到存在元素', () => {
  const arr = [1, 3, 5, 7, 9, 11, 13, 15];
  assert.equal(metaBinarySearch(arr, 1), 0);
  assert.equal(metaBinarySearch(arr, 15), 7);
  assert.equal(metaBinarySearch(arr, 9), 4);
});

test('不存在返回 -1', () => {
  const arr = [1, 3, 5, 7, 9];
  assert.equal(metaBinarySearch(arr, 4), -1);
  assert.equal(metaBinarySearch(arr, 0), -1);
  assert.equal(metaBinarySearch(arr, 10), -1);
});

test('空数组', () => {
  assert.equal(metaBinarySearch([], 5), -1);
});

test('单元素', () => {
  assert.equal(metaBinarySearch([5], 5), 0);
  assert.equal(metaBinarySearch([5], 3), -1);
});

test('非 2 幂长度数组', () => {
  const arr = [10, 20, 30, 40, 50, 60, 70];
  for (const v of arr) {
    assert.equal(arr[metaBinarySearch(arr, v)!], v);
  }
});
