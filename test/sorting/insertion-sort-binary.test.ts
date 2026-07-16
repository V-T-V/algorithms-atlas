import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  binaryInsertionSort,
  upperBound,
} from '../../src/algorithms/sorting/insertion-sort-binary/impl.ts';

test('binaryInsertionSort 基本排序', () => {
  assert.deepEqual(binaryInsertionSort([]), []);
  assert.deepEqual(binaryInsertionSort([1]), [1]);
  assert.deepEqual(binaryInsertionSort([2, 1]), [1, 2]);
  assert.deepEqual(binaryInsertionSort([8, 3, 5, 1, 9, 2, 7]), [1, 2, 3, 5, 7, 8, 9]);
});

test('binaryInsertionSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(binaryInsertionSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(binaryInsertionSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(binaryInsertionSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('upperBound 返回首个大于 value 的下标', () => {
  assert.equal(upperBound([1, 3, 5, 7, 9], 5, 4), 2);
  assert.equal(upperBound([1, 3, 5, 7, 9], 5, 0), 0);
  assert.equal(upperBound([1, 3, 5, 7, 9], 5, 9), 5);
  assert.equal(upperBound([2, 2, 2], 3, 2), 3); // 全部 <= value
  assert.equal(upperBound([1, 2, 2, 3], 4, 2), 3); // upper-bound for 2 -> 首个 >2 是下标 3
});

test('binaryInsertionSort 不修改原数组', () => {
  const input = [3, 1, 2];
  binaryInsertionSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('binaryInsertionSort 钩子被调用', () => {
  let probes = 0;
  let inserts = 0;
  binaryInsertionSort([5, 1, 3], {
    onProbe: () => probes++,
    onInsert: () => inserts++,
  });
  assert.ok(probes > 0, '应发生至少一次二分探测');
  assert.ok(inserts > 0, '应发生至少一次插入');
});
