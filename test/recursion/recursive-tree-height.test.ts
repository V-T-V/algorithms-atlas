import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTree,
  treeHeight,
} from '../../src/algorithms/recursion/recursive-tree-height/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/recursive-tree-height/trace.ts';

test('treeHeight 经典 LeetCode 104', () => {
  //     3
  //    / \
  //   9  20
  //     /  \
  //    15   7
  const root = buildTree([3, 9, 20, null, null, 15, 7]);
  assert.equal(treeHeight(root), 3);
});

test('treeHeight 空树', () => {
  assert.equal(treeHeight(null), 0);
  assert.equal(treeHeight(buildTree([])), 0);
});

test('treeHeight 单节点', () => {
  assert.equal(treeHeight(buildTree([1])), 1);
});

test('treeHeight 退化链（右倾）', () => {
  // 1 -> 2 -> 3
  const root = buildTree([1, null, 2, null, 3]);
  assert.equal(treeHeight(root), 3);
});

test('treeHeight 满二叉树', () => {
  //       1
  //      / \
  //     2   3
  //    / \ / \
  //   4  5 6  7
  assert.equal(treeHeight(buildTree([1, 2, 3, 4, 5, 6, 7])), 3);
});

test('treeHeight 钩子触发', () => {
  let visits = 0;
  treeHeight(buildTree([1, 2, 3]), { onVisit: () => visits++ });
  assert.equal(visits, 3);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
