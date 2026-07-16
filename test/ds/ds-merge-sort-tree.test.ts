import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MergeSortTree } from '../../src/algorithms/ds/ds-merge-sort-tree/impl.ts';

test('全区间 ≤ k 计数', () => {
  const t = new MergeSortTree([3, 1, 4, 1, 5, 9, 2, 6]);
  assert.equal(t.countLE(0, 7, 5), 6); // 3,1,4,1,5,2 ≤ 5
});

test('子区间查询', () => {
  const t = new MergeSortTree([3, 1, 4, 1, 5, 9, 2, 6]);
  // [4,1,5,9] ≤ 4 → 4,1 = 2
  assert.equal(t.countLE(2, 5, 4), 2);
});

test('countLT 严格小于', () => {
  const t = new MergeSortTree([3, 1, 4, 1, 5, 9, 2, 6]);
  assert.equal(t.countLT(0, 7, 5), 5); // < 5：3,1,4,1,2
});

test('单元素区间', () => {
  const t = new MergeSortTree([3, 1, 4, 1, 5]);
  assert.equal(t.countLE(2, 2, 4), 1);
  assert.equal(t.countLE(2, 2, 3), 0);
});

test('单元素数组', () => {
  const t = new MergeSortTree([42]);
  assert.equal(t.countLE(0, 0, 42), 1);
  assert.equal(t.countLE(0, 0, 41), 0);
});
