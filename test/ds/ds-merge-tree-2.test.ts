import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MergeTree2 } from '../../src/algorithms/ds/ds-merge-tree-2/impl.ts';

test('merge-tree countLE', () => {
  const mt = new MergeTree2([5, 2, 8, 1, 9, 3, 7]);
  assert.equal(mt.countLE(0, 6, 3), 2); // 2, 1
  assert.equal(mt.countLE(0, 6, 5), 4); // 5,2,1,3
  assert.equal(mt.countLE(0, 6, 9), 7);
});

test('merge-tree 子区间', () => {
  const mt = new MergeTree2([5, 2, 8, 1, 9, 3, 7]);
  assert.equal(mt.countLE(2, 4, 8), 2); // 8,1 in [2,4]
});
