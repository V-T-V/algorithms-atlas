import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ternarySearchRecursive } from '../../src/algorithms/searching/search-ternary-recursive/impl.ts';

test('找到存在元素', () => {
  const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17];
  for (const v of arr) {
    assert.equal(arr[ternarySearchRecursive(arr, v)!], v);
  }
});

test('不存在返回 -1', () => {
  const arr = [1, 3, 5, 7, 9, 11];
  assert.equal(ternarySearchRecursive(arr, 6), -1);
  assert.equal(ternarySearchRecursive(arr, 0), -1);
  assert.equal(ternarySearchRecursive(arr, 12), -1);
});

test('空数组', () => {
  assert.equal(ternarySearchRecursive([], 5), -1);
});

test('小数组', () => {
  assert.equal(ternarySearchRecursive([5], 5), 0);
  assert.equal(ternarySearchRecursive([1, 3], 3), 1);
});

test('大数组一致', () => {
  const arr = Array.from({ length: 999 }, (_, i) => i * 3);
  for (let k = 0; k < arr.length; k += 50) {
    assert.equal(ternarySearchRecursive(arr, arr[k]!), k);
  }
  assert.equal(ternarySearchRecursive(arr, 1), -1);
});
