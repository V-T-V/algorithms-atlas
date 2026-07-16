import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildBST,
  predecessor,
  inorderPredecessor,
} from '../../src/algorithms/tree/tree-bst-predecessor/impl.ts';

test('predecessor 找小于 key 的最大', () => {
  const root = buildBST([50, 30, 70, 20, 40, 60, 80]);
  assert.equal(predecessor(root, 50)!.value, 40);
  assert.equal(predecessor(root, 30)!.value, 20);
  assert.equal(predecessor(root, 80)!.value, 70);
});

test('predecessor 最小值无前驱', () => {
  const root = buildBST([50, 30, 70, 20]);
  assert.equal(predecessor(root, 20), null);
  assert.equal(predecessor(root, 10), null);
});

test('predecessor 不存在的键', () => {
  const root = buildBST([50, 30, 70]);
  // key=45：小于它的最大是 30
  assert.equal(predecessor(root, 45)!.value, 30);
});

test('inorderPredecessor 存在节点', () => {
  const root = buildBST([50, 30, 70, 20, 40, 60, 80]);
  // 50 的左子树最大是 40
  assert.equal(inorderPredecessor(root, 50)!.value, 40);
});

test('inorderPredecessor 无左子树', () => {
  const root = buildBST([50, 30, 70, 20]);
  // 20 是最左，无前驱
  assert.equal(inorderPredecessor(root, 20), null);
});

test('空树', () => {
  assert.equal(predecessor(null, 5), null);
});

test('单节点树', () => {
  const root = buildBST([5]);
  assert.equal(predecessor(root, 5), null);
  assert.equal(predecessor(root, 10)!.value, 5);
});
