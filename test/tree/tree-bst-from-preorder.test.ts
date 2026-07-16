import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bstFromPreorder,
  preorder,
  inorder,
} from '../../src/algorithms/tree/tree-bst-from-preorder/impl.ts';

test('前序重建后前序一致', () => {
  const pre = [50, 30, 20, 40, 70, 60, 80];
  const root = bstFromPreorder(pre);
  assert.deepEqual(preorder(root), pre);
});

test('重建后中序严格递增', () => {
  const pre = [50, 30, 20, 40, 70, 60, 80];
  const root = bstFromPreorder(pre);
  assert.deepEqual(inorder(root), [20, 30, 40, 50, 60, 70, 80]);
});

test('右斜树', () => {
  const pre = [1, 2, 3, 4, 5];
  const root = bstFromPreorder(pre);
  assert.deepEqual(preorder(root), pre);
  assert.deepEqual(inorder(root), [1, 2, 3, 4, 5]);
});

test('左斜树', () => {
  const pre = [5, 4, 3, 2, 1];
  const root = bstFromPreorder(pre);
  assert.deepEqual(preorder(root), pre);
});

test('单元素', () => {
  const root = bstFromPreorder([42]);
  assert.equal(root!.value, 42);
  assert.equal(root!.left, null);
  assert.equal(root!.right, null);
});

test('空数组返回 null', () => {
  assert.equal(bstFromPreorder([]), null);
});

test('回调触发', () => {
  let creates = 0;
  bstFromPreorder([5, 3, 7], { onCreate: () => creates++ });
  assert.equal(creates, 3);
});
