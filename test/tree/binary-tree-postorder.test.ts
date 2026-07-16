import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  binaryTreePostorder,
  binaryTreePostorderIter,
  buildTree,
} from '../../src/algorithms/tree/binary-tree-postorder/impl.ts';

test('后序遍历 左→右→根', () => {
  //        1
  //       / \
  //      2   3
  //     / \   \
  //    4   5   7
  const root = buildTree([1, 2, 3, 4, 5, null, 7]);
  assert.deepEqual(binaryTreePostorder(root), [4, 5, 2, 7, 3, 1]);
});

test('迭代版与递归版一致', () => {
  const root = buildTree([5, 3, 8, 1, 4, null, 9]);
  assert.deepEqual(binaryTreePostorderIter(root), binaryTreePostorder(root));
});

test('空树与单节点', () => {
  assert.deepEqual(binaryTreePostorder(null), []);
  assert.deepEqual(binaryTreePostorder(buildTree([42])), [42]);
});

test('右斜树（链）', () => {
  //  1
  //   \
  //    2
  //     \
  //      3   后序：先右子树最深处 → [3, 2, 1]
  const root = buildTree([1, null, 2, null, 3]);
  assert.deepEqual(binaryTreePostorder(root), [3, 2, 1]);
});

test('钩子被调用 n 次', () => {
  let calls = 0;
  binaryTreePostorder(buildTree([1, 2, 3]), { onVisit: () => calls++ });
  assert.equal(calls, 3);
});
