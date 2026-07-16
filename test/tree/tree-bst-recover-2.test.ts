import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  recoverTree,
  inorder,
  makeNode,
  BstNode,
} from '../../src/algorithms/tree/tree-bst-recover-2/impl.ts';

test('相邻节点交换', () => {
  // 正确 [1,2,3,4]，构造 [1,3,2,4]（交换 2 和 3）
  // 树形态：3 为根，左 1（右子 2），右 4
  const root = makeNode(3, makeNode(1, null, makeNode(2)), makeNode(4));
  assert.deepEqual(inorder(root), [1, 3, 2, 4]);
  recoverTree(root);
  assert.deepEqual(inorder(root), [1, 2, 3, 4]);
});

test('非相邻节点交换', () => {
  // 构造非法：根 2，左 3，右 1 → 中序 3,2,1
  const bad = makeNode(2, new BstNode(3), new BstNode(1));
  assert.deepEqual(inorder(bad), [3, 2, 1]);
  recoverTree(bad);
  assert.deepEqual(inorder(bad), [1, 2, 3]);
});

test('根与最右叶交换', () => {
  // [1,2,3]：构造根 3，左 1（右子 2）→ 中序 1,2,3 合法
  // 改为根 1，右 2（右子 3）→ 中序 1,2,3 合法
  // 真正非法：根 2，左 1，右 3，但交换 2 和 3 的值 → 根 3，左 1，右 2 → 中序 1,3,2
  const root = makeNode(3, makeNode(1), makeNode(2));
  assert.deepEqual(inorder(root), [1, 3, 2]);
  recoverTree(root);
  assert.deepEqual(inorder(root), [1, 2, 3]);
});

test('合法 BST 无恢复', () => {
  const root = makeNode(2, makeNode(1), makeNode(3));
  const r = recoverTree(root);
  assert.equal(r, null);
  assert.deepEqual(inorder(root), [1, 2, 3]);
});

test('空树', () => {
  assert.equal(recoverTree(null), null);
});

test('单节点', () => {
  assert.equal(recoverTree(makeNode(5)), null);
});

test('回调触发（有逆序）', () => {
  let inversions = 0;
  const root = makeNode(2, new BstNode(3), new BstNode(1));
  recoverTree(root, { onInversion: () => inversions++ });
  assert.ok(inversions >= 1);
});
