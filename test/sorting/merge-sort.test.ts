import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeSort } from '../../src/algorithms/sorting/merge-sort/impl.ts';

test('mergeSort 基本排序', () => {
  assert.deepEqual(mergeSort([]), []);
  assert.deepEqual(mergeSort([1]), [1]);
  assert.deepEqual(mergeSort([2, 1]), [1, 2]);
  assert.deepEqual(mergeSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('mergeSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(mergeSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(mergeSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(mergeSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('mergeSort 不修改原数组', () => {
  const input = [3, 1, 2];
  mergeSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('mergeSort 钩子被调用', () => {
  let splits = 0;
  let merges = 0;
  let writes = 0;
  mergeSort([3, 1, 2], {
    onSplit: () => splits++,
    onMergeStart: () => merges++,
    onWrite: () => writes++,
  });
  assert.ok(splits > 0, '应发生至少一次分割');
  assert.ok(merges > 0, '应发生至少一次合并');
  assert.ok(writes >= 3, '合并应至少写入 3 次');
});
