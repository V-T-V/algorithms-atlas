import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jumpSearch } from '../../src/algorithms/searching/search-jump-2/impl.ts';

test('找到存在元素', () => {
  const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  assert.equal(jumpSearch(arr, 1), 0);
  assert.equal(jumpSearch(arr, 19), 9);
  assert.equal(jumpSearch(arr, 11), 5);
});

test('不存在返回 -1', () => {
  const arr = [1, 3, 5, 7, 9];
  assert.equal(jumpSearch(arr, 4), -1);
  assert.equal(jumpSearch(arr, 0), -1);
  assert.equal(jumpSearch(arr, 10), -1);
});

test('空数组', () => {
  assert.equal(jumpSearch([], 5), -1);
});

test('单元素', () => {
  assert.equal(jumpSearch([5], 5), 0);
  assert.equal(jumpSearch([5], 3), -1);
});

test('大数组一致', () => {
  const arr = Array.from({ length: 1000 }, (_, i) => i * 2);
  for (let k = 0; k < 1000; k += 100) {
    assert.equal(jumpSearch(arr, arr[k]!), k);
  }
  assert.equal(jumpSearch(arr, 1), -1);
});
