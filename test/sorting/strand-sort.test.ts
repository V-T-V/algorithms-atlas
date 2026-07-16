import { test } from 'node:test';
import assert from 'node:assert/strict';
import { strandSort } from '../../src/algorithms/sorting/strand-sort/impl.ts';

test('strandSort 基本排序', () => {
  assert.deepEqual(strandSort([]), []);
  assert.deepEqual(strandSort([1]), [1]);
  assert.deepEqual(strandSort([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
  assert.deepEqual(strandSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('strandSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(strandSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(strandSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(strandSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('strandSort 不修改原数组', () => {
  const input = [3, 1, 2];
  strandSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('strandSort 钩子被调用', () => {
  let starts = 0;
  let merges = 0;
  strandSort([3, 1, 2], {
    onStrandStart: () => starts++,
    onMerge: () => merges++,
  });
  assert.ok(starts >= 1, '应至少开始一个子链');
  assert.ok(merges >= 1, '应至少合并一次');
});
