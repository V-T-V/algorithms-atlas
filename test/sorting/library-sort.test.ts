import { test } from 'node:test';
import assert from 'node:assert/strict';
import { librarySort } from '../../src/algorithms/sorting/library-sort/impl.ts';

test('librarySort 基本排序', () => {
  assert.deepEqual(librarySort([]), []);
  assert.deepEqual(librarySort([1]), [1]);
  assert.deepEqual(librarySort([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
  assert.deepEqual(librarySort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('librarySort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(librarySort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(librarySort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(librarySort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('librarySort 不修改原数组', () => {
  const input = [3, 1, 2];
  librarySort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('librarySort 钩子被调用', () => {
  let inserts = 0;
  librarySort([3, 1, 2], {
    onInsert: () => inserts++,
  });
  assert.equal(inserts, 3, '每个元素插入一次');
});
