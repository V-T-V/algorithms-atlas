import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gallopSearch } from '../../src/algorithms/searching/search-gallop-2/impl.ts';

test('找到存在元素', () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  assert.equal(gallopSearch(arr, 1), 0);
  assert.equal(gallopSearch(arr, 10), 9);
  assert.equal(gallopSearch(arr, 5), 4);
});

test('不存在返回 -1', () => {
  const arr = [1, 3, 5, 7, 9];
  assert.equal(gallopSearch(arr, 0), -1);
  assert.equal(gallopSearch(arr, 4), -1);
  assert.equal(gallopSearch(arr, 10), -1);
});

test('空数组', () => {
  assert.equal(gallopSearch([], 5), -1);
});

test('单元素', () => {
  assert.equal(gallopSearch([5], 5), 0);
  assert.equal(gallopSearch([5], 3), -1);
  assert.equal(gallopSearch([5], 7), -1);
});

test('大数组前段定位', () => {
  const arr = Array.from({ length: 10000 }, (_, i) => i + 1);
  assert.equal(gallopSearch(arr, 10), 9);
  assert.equal(gallopSearch(arr, 1), 0);
});
