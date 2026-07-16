import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  flattenToLinked,
  buildTree,
  rightChainValues,
} from '../../src/algorithms/tree/tree-flatten-linked/impl.ts';

test('flattenToLinked 前序链表', () => {
  //     1          1
  //    / \          \
  //   2   5   →      2
  //  / \   \          \
  // 3   4   6          3
  //                     \
  //                      4
  //                       \
  //                        5
  //                         \
  //                          6
  const root = buildTree([1, 2, 5, 3, 4, null, 6]);
  const flat = flattenToLinked(root);
  assert.deepEqual(rightChainValues(flat), [1, 2, 3, 4, 5, 6]);
});

test('flattenToLinked 右单链不变', () => {
  // 1 → 2 → 3 已是右单链
  const root = buildTree([1, null, 2, null, 3]);
  const flat = flattenToLinked(root);
  assert.deepEqual(rightChainValues(flat), [1, 2, 3]);
});

test('flattenToLinked 不修改原树', () => {
  const root = buildTree([1, 2, 5, 3]);
  flattenToLinked(root);
  // 原树仍应是 1(2(3),5)
  assert.notEqual(root!.left, null);
  assert.equal(root!.left!.value, 2);
});

test('flattenToLinked 边界', () => {
  assert.equal(flattenToLinked(null), null);
  assert.deepEqual(rightChainValues(flattenToLinked(buildTree([1]))), [1]);
});

test('flattenToLinked 钩子触发拼接', () => {
  let splices = 0;
  flattenToLinked(buildTree([1, 2, 5, 3, 4]), { onSplice: () => splices++ });
  // 节点 1、2 有非空左子，会拼接
  assert.ok(splices >= 2);
});
