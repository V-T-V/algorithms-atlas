import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  insert,
  buildBST,
  inorder,
  BstNode,
} from '../../src/algorithms/tree/tree-bst-insert/impl.ts';

test('插入到空树', () => {
  const root = insert(null, 5);
  assert.equal(root!.value, 5);
  assert.equal(root!.left, null);
  assert.equal(root!.right, null);
});

test('插入保持 BST 性质（中序升序）', () => {
  const root = buildBST([50, 30, 70, 20, 40, 60, 80]);
  assert.deepEqual(inorder(root), [20, 30, 40, 50, 60, 70, 80]);
});

test('相等键不重复插入', () => {
  const root = buildBST([5, 5, 5]);
  assert.deepEqual(inorder(root), [5]);
});

test('链化（最坏情况）', () => {
  const root = buildBST([1, 2, 3, 4, 5]);
  assert.deepEqual(inorder(root), [1, 2, 3, 4, 5]);
  // 应是右链
  let node = root;
  let depth = 0;
  while (node !== null) {
    depth++;
    node = node.right;
  }
  assert.equal(depth, 5);
});

test('回调触发', () => {
  let compares = 0;
  let attaches = 0;
  buildBST([5, 3], { onCompare: () => compares++, onAttach: () => attaches++ });
  assert.ok(compares >= 1);
  assert.ok(attaches >= 2);
});

test('inorder 空树', () => {
  assert.deepEqual(inorder(null), []);
});

test('buildBST 空数组返回 null', () => {
  assert.equal(buildBST([]), null);
});

test('BstNode 类构造', () => {
  const n = new BstNode(10);
  assert.equal(n.value, 10);
  assert.equal(n.left, null);
});
