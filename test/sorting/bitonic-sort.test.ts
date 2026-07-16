import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bitonicSort } from '../../src/algorithms/sorting/bitonic-sort/impl.ts';

test('bitonicSort 基本排序', () => {
  assert.deepEqual(bitonicSort([]), []);
  assert.deepEqual(bitonicSort([1]), [1]);
  assert.deepEqual(bitonicSort([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
  assert.deepEqual(bitonicSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('bitonicSort 2 的幂长度', () => {
  assert.deepEqual(bitonicSort([8, 4, 2, 1]), [1, 2, 4, 8]);
});

test('bitonicSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(bitonicSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(bitonicSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(bitonicSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('bitonicSort 不修改原数组', () => {
  const input = [3, 1, 2];
  bitonicSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('bitonicSort 钩子被调用', () => {
  let compares = 0;
  let swaps = 0;
  bitonicSort([4, 3, 2, 1], {
    onCompare: () => compares++,
    onSwap: () => swaps++,
  });
  assert.ok(compares > 0, '应发生比较');
  assert.ok(swaps > 0, '应发生交换');
});
