import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combSort } from '../../src/algorithms/sorting/comb-sort/impl.ts';

test('combSort 基本排序', () => {
  assert.deepEqual(combSort([]), []);
  assert.deepEqual(combSort([1]), [1]);
  assert.deepEqual(combSort([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
  assert.deepEqual(combSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('combSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(combSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(combSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(combSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('combSort 不修改原数组', () => {
  const input = [3, 1, 2];
  combSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('combSort 钩子被调用', () => {
  let gaps = 0;
  let compares = 0;
  let swaps = 0;
  combSort([5, 1, 4, 2, 8], {
    onGap: () => gaps++,
    onCompare: () => compares++,
    onSwap: () => swaps++,
  });
  assert.ok(gaps >= 1, '应至少一次 gap 收缩');
  assert.ok(compares > 0, '应发生比较');
  assert.ok(swaps > 0, '应发生交换');
});
