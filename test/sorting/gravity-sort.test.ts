import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gravitySort } from '../../src/algorithms/sorting/gravity-sort/impl.ts';

test('gravitySort 基本排序', () => {
  assert.deepEqual(gravitySort([]), []);
  assert.deepEqual(gravitySort([1]), [1]);
  assert.deepEqual(gravitySort([5, 3, 1, 4, 2]), [1, 2, 3, 4, 5]);
  assert.deepEqual(gravitySort([7, 2, 9, 1, 5, 3]), [1, 2, 3, 5, 7, 9]);
});

test('gravitySort 已有序 / 逆序 / 重复 / 含零', () => {
  assert.deepEqual(gravitySort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(gravitySort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(gravitySort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
  assert.deepEqual(gravitySort([0, 0, 3, 0]), [0, 0, 0, 3]);
  assert.deepEqual(gravitySort([0, 0, 0]), [0, 0, 0]);
});

test('gravitySort 不修改原数组', () => {
  const input = [3, 1, 2];
  gravitySort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('gravitySort 拒绝非负整数外输入', () => {
  assert.throws(() => gravitySort([-1, 2]), RangeError);
  assert.throws(() => gravitySort([1.5, 2]), RangeError);
});
