import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  binaryTreePreorder,
  binaryTreePreorderIter,
  buildTree,
} from '../../src/algorithms/tree/binary-tree-preorder/impl.ts';

test('前序遍历 根→左→右', () => {
  //        1
  //       / \
  //      2   3
  //     / \   \
  //    4   5   7
  const root = buildTree([1, 2, 3, 4, 5, null, 7]);
  assert.deepEqual(binaryTreePreorder(root), [1, 2, 4, 5, 3, 7]);
});

test('迭代版与递归版结果一致', () => {
  const root = buildTree([5, 3, 8, 1, 4, null, 9]);
  assert.deepEqual(binaryTreePreorderIter(root), binaryTreePreorder(root));
});

test('空树返回空数组', () => {
  assert.deepEqual(binaryTreePreorder(null), []);
  assert.deepEqual(binaryTreePreorderIter(null), []);
});

test('单节点', () => {
  const root = buildTree([42]);
  assert.deepEqual(binaryTreePreorder(root), [42]);
});

test('钩子被调用 n 次', () => {
  let calls = 0;
  const root = buildTree([1, 2, 3]);
  binaryTreePreorder(root, { onVisit: () => calls++ });
  assert.equal(calls, 3);
});
