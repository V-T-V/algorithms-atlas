import { test } from 'node:test';
import assert from 'node:assert/strict';
import { robTree, type TreeNode5 } from '../../src/algorithms/dp/dp-house-robber-5/impl.ts';

test('robTree LC337 例1', () => {
  const root: TreeNode5 = {
    val: 3,
    left: { val: 2, right: { val: 3 } },
    right: { val: 3, right: { val: 1 } },
  };
  assert.equal(robTree(root), 7);
});

test('robTree LC337 例2', () => {
  const root: TreeNode5 = {
    val: 3,
    left: { val: 4, left: { val: 1 }, right: { val: 3 } },
    right: { val: 5, right: { val: 1 } },
  };
  assert.equal(robTree(root), 9);
});

test('robTree 单节点', () => {
  assert.equal(robTree({ val: 5 }), 5);
});

test('robTree 空树', () => {
  assert.equal(robTree(null), 0);
});
