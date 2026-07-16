import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recursiveBinarySearch } from '../../src/algorithms/recursion/recursive-binary-search/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/recursive-binary-search/trace.ts';

test('recursiveBinarySearch 找到目标', () => {
  const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  assert.equal(recursiveBinarySearch(arr, 11), 5);
  assert.equal(recursiveBinarySearch(arr, 1), 0);
  assert.equal(recursiveBinarySearch(arr, 19), 9);
});

test('recursiveBinarySearch 未找到', () => {
  const arr = [1, 3, 5, 7, 9];
  assert.equal(recursiveBinarySearch(arr, 4), -1);
  assert.equal(recursiveBinarySearch(arr, 0), -1);
  assert.equal(recursiveBinarySearch(arr, 100), -1);
});

test('recursiveBinarySearch 空数组', () => {
  assert.equal(recursiveBinarySearch([], 5), -1);
});

test('recursiveBinarySearch 单元素', () => {
  assert.equal(recursiveBinarySearch([5], 5), 0);
  assert.equal(recursiveBinarySearch([5], 3), -1);
});

test('recursiveBinarySearch 重复元素（返回某一处）', () => {
  const arr = [2, 4, 4, 4, 6];
  const idx = recursiveBinarySearch(arr, 4);
  assert.ok(idx >= 1 && idx <= 3);
  assert.equal(arr[idx], 4);
});

test('recursiveBinarySearch 钩子触发', () => {
  let probes = 0;
  recursiveBinarySearch([1, 2, 3, 4, 5], 3, { onProbe: () => probes++ });
  assert.ok(probes >= 1);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
