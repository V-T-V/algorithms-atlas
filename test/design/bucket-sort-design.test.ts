import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bucketSort } from '../../src/algorithms/design/bucket-sort-design/impl.ts';

test('bucketSort 基本排序', () => {
  assert.deepEqual(
    bucketSort([0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68]),
    [0.12, 0.17, 0.21, 0.23, 0.26, 0.39, 0.68, 0.72, 0.78, 0.94],
  );
});

test('bucketSort 整数', () => {
  assert.deepEqual(bucketSort([5, 3, 8, 1, 9, 2, 7]), [1, 2, 3, 5, 7, 8, 9]);
});

test('bucketSort 空数组与单元素', () => {
  assert.deepEqual(bucketSort([]), []);
  assert.deepEqual(bucketSort([42]), [42]);
});

test('bucketSort 已排序', () => {
  assert.deepEqual(bucketSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
});

test('bucketSort 逆序', () => {
  assert.deepEqual(bucketSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
});

test('bucketSort 含重复', () => {
  assert.deepEqual(bucketSort([3, 1, 2, 3, 1, 2]), [1, 1, 2, 2, 3, 3]);
});

test('bucketSort 全相同', () => {
  assert.deepEqual(bucketSort([7, 7, 7, 7]), [7, 7, 7, 7]);
});

test('bucketSort 指定桶数', () => {
  assert.deepEqual(bucketSort([9, 1, 5, 3, 7], 2), [1, 3, 5, 7, 9]);
});

test('bucketSort 与内置 sort 一致', () => {
  const arr = [3.1, 1.4, 1.5, 9.2, 6.5, 3.5];
  assert.deepEqual(
    bucketSort(arr),
    [...arr].sort((a, b) => a - b),
  );
});

test('bucketSort 不修改原数组', () => {
  const input = [3, 1, 2];
  bucketSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});
