import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  binaryTreeInorder,
  binaryTreeInorderIter,
  buildTree,
} from '../../src/algorithms/tree/binary-tree-inorder/impl.ts';

test('中序遍历 左→根→右', () => {
  //        1
  //       / \
  //      2   3
  //     / \   \
  //    4   5   7
  const root = buildTree([1, 2, 3, 4, 5, null, 7]);
  assert.deepEqual(binaryTreeInorder(root), [4, 2, 5, 1, 3, 7]);
});

test('中序遍历 BST 得到升序', () => {
  const root = buildTree([4, 2, 6, 1, 3, 5, 7]);
  assert.deepEqual(binaryTreeInorder(root), [1, 2, 3, 4, 5, 6, 7]);
});

test('迭代版与递归版一致', () => {
  const root = buildTree([5, 3, 8, 1, 4, null, 9]);
  assert.deepEqual(binaryTreeInorderIter(root), binaryTreeInorder(root));
});

test('空树与单节点', () => {
  assert.deepEqual(binaryTreeInorder(null), []);
  assert.deepEqual(binaryTreeInorder(buildTree([42])), [42]);
});

test('钩子被调用 n 次', () => {
  let calls = 0;
  binaryTreeInorder(buildTree([1, 2, 3]), { onVisit: () => calls++ });
  assert.equal(calls, 3);
});
