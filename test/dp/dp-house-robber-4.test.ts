import { test } from 'node:test';
import assert from 'node:assert/strict';
import { robTree, buildTree } from '../../src/algorithms/dp/dp-house-robber-4/impl.ts';

test('rob-tree LeetCode 337 例 1', () => {
  // [3,2,3,null,3,null,1] => 抢 3(根)+3+1=7
  assert.equal(robTree(buildTree([3, 2, 3, null, 3, null, 1])), 7);
});

test('rob-tree LeetCode 337 例 2', () => {
  // [3,4,5,1,3,null,1] => 抢 4+5=9
  assert.equal(robTree(buildTree([3, 4, 5, 1, 3, null, 1])), 9);
});

test('rob-tree 单节点', () => {
  assert.equal(robTree(buildTree([5])), 5);
});

test('rob-tree 空树', () => {
  assert.equal(robTree(null), 0);
});

test('rob-tree 两节点', () => {
  // [2,1] 只能抢根 2
  assert.equal(robTree(buildTree([2, 1])), 2);
});
