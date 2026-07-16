import { test } from 'node:test';
import assert from 'node:assert/strict';
import { treeSortBst, type TreeBstHooks } from '../../src/algorithms/sorting/sort-tree-bst/impl.ts';

test('treeSortBst 基本', () => {
  assert.deepEqual(treeSortBst([]), []);
  assert.deepEqual(treeSortBst([1]), [1]);
  assert.deepEqual(treeSortBst([2, 1]), [1, 2]);
  assert.deepEqual(treeSortBst([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('treeSortBst 去重', () => {
  assert.deepEqual(treeSortBst([3, 3, 1, 2, 2, 1]), [1, 2, 3]);
});
test('treeSortBst 钩子', () => {
  let c = 0;
  treeSortBst([3, 1, 2], { onVisit: () => c++ } as TreeBstHooks);
  assert.ok(c >= 1);
});
