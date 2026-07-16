import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  binaryTreeZigzag,
  binaryTreeZigzagGrouped,
  buildTree,
} from '../../src/algorithms/tree/binary-tree-zigzag/impl.ts';

test('锯齿遍历 奇偶层交替方向', () => {
  //        1          L0: [1]
  //       / \
  //      2   3        L1: [3,2]  (反转)
  //     / \ / \
  //    4  5 6  7      L2: [4,5,6,7]
  const root = buildTree([1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(binaryTreeZigzag(root), [1, 3, 2, 4, 5, 6, 7]);
});

test('锯齿分组正确', () => {
  const root = buildTree([1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(binaryTreeZigzagGrouped(root), [[1], [3, 2], [4, 5, 6, 7]]);
});

test('空树与单节点', () => {
  assert.deepEqual(binaryTreeZigzag(null), []);
  assert.deepEqual(binaryTreeZigzagGrouped(null), []);
  assert.deepEqual(binaryTreeZigzag(buildTree([42])), [42]);
});

test('不对称树', () => {
  //    1
  //   / \
  //  2   3
  //   \   \
  //    4   5   层序 [1,2,3,null,4,null,5]
  const root = buildTree([1, 2, 3, null, 4, null, 5]);
  // L0:[1] L1:[3,2] L2:[4,5]
  assert.deepEqual(binaryTreeZigzagGrouped(root), [[1], [3, 2], [4, 5]]);
});

test('钩子被调用 n 次', () => {
  let calls = 0;
  binaryTreeZigzag(buildTree([1, 2, 3]), { onVisit: () => calls++ });
  assert.equal(calls, 3);
});
