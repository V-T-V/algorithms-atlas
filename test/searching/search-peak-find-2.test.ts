import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findPeak, isPeak } from '../../src/algorithms/searching/search-peak-find-2/impl.ts';

test('找到的索引是峰值', () => {
  const arr = [1, 3, 20, 4, 1, 0, 7, 12, 9];
  const idx = findPeak(arr);
  assert.ok(isPeak(arr, idx));
});

test('单调递增数组末元素是峰', () => {
  const arr = [1, 2, 3, 4, 5];
  const idx = findPeak(arr);
  assert.equal(idx, 4);
  assert.ok(isPeak(arr, idx));
});

test('单调递减数组首元素是峰', () => {
  const arr = [5, 4, 3, 2, 1];
  const idx = findPeak(arr);
  assert.equal(idx, 0);
  assert.ok(isPeak(arr, idx));
});

test('单元素', () => {
  assert.equal(findPeak([42]), 0);
});

test('两元素', () => {
  assert.equal(findPeak([1, 2]), 1);
  assert.equal(findPeak([2, 1]), 0);
});

test('空数组抛错', () => {
  assert.throws(() => findPeak([]), RangeError);
});

test('大数组仍找到有效峰', () => {
  const arr = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 1000));
  arr[500] = 100000; // 明显的峰
  const idx = findPeak(arr);
  assert.ok(isPeak(arr, idx));
});
