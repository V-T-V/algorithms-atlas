import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sentinelSearch,
  sentinelSearchInPlace,
} from '../../src/algorithms/searching/search-sentinel-2/impl.ts';

test('找到存在元素（首个）', () => {
  const arr = [4, 2, 7, 1, 9, 3, 8, 5, 6];
  assert.equal(sentinelSearch(arr, 7), 2);
  assert.equal(sentinelSearch(arr, 4), 0);
  assert.equal(sentinelSearch(arr, 6), 8);
});

test('不存在返回 -1', () => {
  const arr = [4, 2, 7, 1];
  assert.equal(sentinelSearch(arr, 99), -1);
});

test('空数组', () => {
  assert.equal(sentinelSearch([], 5), -1);
});

test('重复元素返回首个', () => {
  const arr = [3, 3, 3, 5, 5];
  assert.equal(sentinelSearch(arr, 3), 0);
  assert.equal(sentinelSearch(arr, 5), 3);
});

test('sentinelSearchInPlace 不修改数组', () => {
  const arr = [4, 2, 7, 1];
  const orig = [...arr];
  const idx = sentinelSearchInPlace(arr, 7);
  assert.equal(idx, 2);
  assert.deepEqual(arr, orig);
});

test('sentinelSearchInPlace 末元素命中', () => {
  const arr = [4, 2, 7, 1];
  assert.equal(sentinelSearchInPlace(arr, 1), 3);
  assert.equal(sentinelSearchInPlace(arr, 99), -1);
});
