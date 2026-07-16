import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidBST, BstNode } from '../../src/algorithms/tree/tree-bst-validate/impl.ts';

test('合法 BST', () => {
  const root = new BstNode(
    5,
    new BstNode(3, new BstNode(2), new BstNode(4)),
    new BstNode(7, new BstNode(6), new BstNode(8)),
  );
  assert.equal(isValidBST(root), true);
});

test('违反右子树下界', () => {
  // 5 的右子 3 小于 5
  const root = new BstNode(5, new BstNode(3), new BstNode(3));
  assert.equal(isValidBST(root), false);
});

test('深层违反（孙节点越界）', () => {
  // 10 -> 5 (left) -> 15 (right of 5)：15 > 10 违反
  const root = new BstNode(10, new BstNode(5, null, new BstNode(15)), null);
  assert.equal(isValidBST(root), false);
});

test('空树合法', () => {
  assert.equal(isValidBST(null), true);
});

test('单节点合法', () => {
  assert.equal(isValidBST(new BstNode(5)), true);
});

test('左子等于根（不允许）', () => {
  const root = new BstNode(5, new BstNode(5), null);
  assert.equal(isValidBST(root), false);
});

test('回调触发', () => {
  let visits = 0;
  const root = new BstNode(5, new BstNode(3), new BstNode(7));
  isValidBST(root, { onVisit: () => visits++ });
  assert.equal(visits, 3);
});

test('左斜树合法', () => {
  const root = new BstNode(5, new BstNode(4, new BstNode(3, new BstNode(2)), null), null);
  assert.equal(isValidBST(root), true);
});
