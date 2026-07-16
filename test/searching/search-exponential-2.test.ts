import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exponentialSearch } from '../../src/algorithms/searching/search-exponential-2/impl.ts';

test('找到存在元素', () => {
  const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  assert.equal(exponentialSearch(arr, 1), 0);
  assert.equal(exponentialSearch(arr, 19), 9);
  assert.equal(exponentialSearch(arr, 11), 5);
});

test('不存在返回 -1', () => {
  const arr = [1, 3, 5, 7, 9];
  assert.equal(exponentialSearch(arr, 4), -1);
  assert.equal(exponentialSearch(arr, 10), -1);
});

test('空数组', () => {
  assert.equal(exponentialSearch([], 5), -1);
});

test('单元素', () => {
  assert.equal(exponentialSearch([5], 5), 0);
  assert.equal(exponentialSearch([5], 3), -1);
});

test('大数组（目标靠前）', () => {
  const arr = Array.from({ length: 10000 }, (_, i) => i * 2);
  assert.equal(exponentialSearch(arr, 10), 5);
  assert.equal(exponentialSearch(arr, 4), 2);
});
