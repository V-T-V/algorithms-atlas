import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fibonacciSearch } from '../../src/algorithms/searching/search-fibonacci-2/impl.ts';

test('找到存在元素', () => {
  const arr = [10, 22, 35, 40, 45, 50, 80, 82, 85, 90, 100];
  for (const v of arr) {
    const idx = fibonacciSearch(arr, v);
    assert.equal(idx !== -1 ? arr[idx] : -1, v);
  }
});

test('不存在返回 -1', () => {
  const arr = [1, 3, 5, 7, 9, 11];
  assert.equal(fibonacciSearch(arr, 6), -1);
  assert.equal(fibonacciSearch(arr, 0), -1);
  assert.equal(fibonacciSearch(arr, 100), -1);
});

test('空数组', () => {
  assert.equal(fibonacciSearch([], 5), -1);
});

test('单元素', () => {
  assert.equal(fibonacciSearch([5], 5), 0);
  assert.equal(fibonacciSearch([5], 3), -1);
});

test('大数组一致', () => {
  const arr = Array.from({ length: 1000 }, (_, i) => i * 3);
  assert.equal(fibonacciSearch(arr, 300), 100);
  assert.equal(fibonacciSearch(arr, 1), -1);
});
