import { test } from 'node:test';
import assert from 'node:assert/strict';
import { treeSort } from '../../src/algorithms/sorting/tree-sort/impl.ts';

test('treeSort 基本排序', () => {
  assert.deepEqual(treeSort([]), []);
  assert.deepEqual(treeSort([1]), [1]);
  assert.deepEqual(treeSort([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
  assert.deepEqual(treeSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('treeSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(treeSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(treeSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(treeSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('treeSort 不修改原数组', () => {
  const input = [3, 1, 2];
  treeSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('treeSort 钩子被调用', () => {
  let inserts = 0;
  let visits = 0;
  treeSort([3, 1, 2], {
    onInsert: () => inserts++,
    onVisit: () => visits++,
  });
  assert.equal(inserts, 3, '每个元素插入一次');
  assert.equal(visits, 3, '中序遍历访问每个元素一次');
});
