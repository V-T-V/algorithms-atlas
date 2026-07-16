import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildBST,
  successor,
  inorderSuccessor,
} from '../../src/algorithms/tree/tree-bst-successor/impl.ts';

test('successor 找大于 key 的最小', () => {
  const root = buildBST([50, 30, 70, 20, 40, 60, 80]);
  assert.equal(successor(root, 50)!.value, 60);
  assert.equal(successor(root, 30)!.value, 40);
  assert.equal(successor(root, 20)!.value, 30);
});

test('successor 最大值无后继', () => {
  const root = buildBST([50, 30, 70, 80]);
  assert.equal(successor(root, 80), null);
  assert.equal(successor(root, 100), null);
});

test('successor 不存在的键', () => {
  const root = buildBST([50, 30, 70]);
  // key=45：大于它的最小是 50
  assert.equal(successor(root, 45)!.value, 50);
});

test('inorderSuccessor 右子树最小', () => {
  const root = buildBST([50, 30, 70, 60, 80]);
  // 50 的右子树最小是 60
  assert.equal(inorderSuccessor(root, 50)!.value, 60);
});

test('inorderSuccessor 无右子树', () => {
  const root = buildBST([50, 30, 70, 80]);
  // 80 是最右，无后继
  assert.equal(inorderSuccessor(root, 80), null);
});

test('空树', () => {
  assert.equal(successor(null, 5), null);
});

test('单节点树', () => {
  const root = buildBST([5]);
  assert.equal(successor(root, 5), null);
  assert.equal(successor(root, 3)!.value, 5);
});
