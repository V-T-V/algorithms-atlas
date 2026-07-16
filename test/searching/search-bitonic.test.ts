import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bitonicSearch,
  findBitonicPeak,
} from '../../src/algorithms/searching/search-bitonic/impl.ts';

test('找到升序段的元素', () => {
  const arr = [1, 3, 8, 12, 9, 5, 2];
  assert.equal(bitonicSearch(arr, 8), 2);
  assert.equal(bitonicSearch(arr, 1), 0);
});

test('找到降序段的元素', () => {
  const arr = [1, 3, 8, 12, 9, 5, 2];
  assert.equal(bitonicSearch(arr, 5), 5);
  assert.equal(bitonicSearch(arr, 2), 6);
});

test('找到峰值元素', () => {
  const arr = [1, 3, 8, 12, 9, 5, 2];
  assert.equal(bitonicSearch(arr, 12), 3);
});

test('不存在返回 -1', () => {
  const arr = [1, 3, 8, 12, 9, 5, 2];
  assert.equal(bitonicSearch(arr, 4), -1);
  assert.equal(bitonicSearch(arr, 100), -1);
});

test('findBitonicPeak 正确', () => {
  const arr = [1, 3, 8, 12, 9, 5, 2];
  assert.equal(findBitonicPeak(arr), 3);
  assert.equal(arr[findBitonicPeak(arr)], 12);
});

test('空数组', () => {
  assert.equal(bitonicSearch([], 5), -1);
});

test('单调（特殊双调：峰值在端点）', () => {
  // 严格双调要求两侧都有，但 findPeak 容忍单调
  assert.equal(bitonicSearch([1, 2, 3, 4, 5], 4), 3);
});
