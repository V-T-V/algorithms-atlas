import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  binaryTreeLevel,
  binaryTreeLevelGrouped,
  buildTree,
} from '../../src/algorithms/tree/binary-tree-level/impl.ts';

test('层序遍历 自顶向下逐层', () => {
  //        1
  //       / \
  //      2   3
  //     / \   \
  //    4   5   7
  const root = buildTree([1, 2, 3, 4, 5, null, 7]);
  assert.deepEqual(binaryTreeLevel(root), [1, 2, 3, 4, 5, 7]);
});

test('层序分组正确', () => {
  const root = buildTree([1, 2, 3, 4, 5, null, 7]);
  assert.deepEqual(binaryTreeLevelGrouped(root), [[1], [2, 3], [4, 5, 7]]);
});

test('空树与单节点', () => {
  assert.deepEqual(binaryTreeLevel(null), []);
  assert.deepEqual(binaryTreeLevelGrouped(null), []);
  assert.deepEqual(binaryTreeLevel(buildTree([42])), [42]);
});

test('钩子给出正确的层号', () => {
  const visited: Array<[number, number]> = [];
  const root = buildTree([1, 2, 3, 4]);
  binaryTreeLevel(root, { onVisit: (v, level) => visited.push([v, level]) });
  assert.deepEqual(visited, [
    [1, 0],
    [2, 1],
    [3, 1],
    [4, 2],
  ]);
});

test('钩子被调用 n 次', () => {
  let calls = 0;
  binaryTreeLevel(buildTree([1, 2, 3]), { onVisit: () => calls++ });
  assert.equal(calls, 3);
});
