import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interpolationSearch } from '../../src/algorithms/searching/search-interpolation-2/impl.ts';

test('均匀数据找到元素', () => {
  const arr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  assert.equal(interpolationSearch(arr, 10), 0);
  assert.equal(interpolationSearch(arr, 100), 9);
  assert.equal(interpolationSearch(arr, 50), 4);
});

test('不存在返回 -1', () => {
  const arr = [10, 20, 30, 40, 50];
  assert.equal(interpolationSearch(arr, 5), -1);
  assert.equal(interpolationSearch(arr, 60), -1);
});

test('空数组', () => {
  assert.equal(interpolationSearch([], 5), -1);
});

test('单元素', () => {
  assert.equal(interpolationSearch([5], 5), 0);
  assert.equal(interpolationSearch([5], 3), -1);
});

test('全相等数组', () => {
  const arr = [7, 7, 7, 7, 7];
  assert.equal(interpolationSearch(arr, 7), 2);
  assert.equal(interpolationSearch(arr, 5), -1);
});

test('大均匀数组', () => {
  const arr = Array.from({ length: 1000 }, (_, i) => i * 10);
  assert.equal(interpolationSearch(arr, 5000), 500);
  assert.equal(interpolationSearch(arr, 9990), 999);
});
