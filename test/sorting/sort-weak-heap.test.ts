import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weakHeapSort } from '../../src/algorithms/sorting/sort-weak-heap/impl.ts';

test('weakHeapSort（三叉堆变体）基本排序', () => {
  assert.deepEqual(weakHeapSort([]), []);
  assert.deepEqual(weakHeapSort([1]), [1]);
  assert.deepEqual(weakHeapSort([2, 1]), [1, 2]);
  assert.deepEqual(weakHeapSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('weakHeapSort 已有序/逆序/重复', () => {
  assert.deepEqual(weakHeapSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(weakHeapSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(weakHeapSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('weakHeapSort 不修改原数组', () => {
  const input = [3, 1, 2];
  weakHeapSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('weakHeapSort 钩子被调用', () => {
  let builds = 0;
  let pops = 0;
  weakHeapSort([3, 1, 2], { onBuildMax: () => builds++, onPopMax: () => pops++ });
  assert.ok(builds >= 1);
  assert.ok(pops >= 1);
});
