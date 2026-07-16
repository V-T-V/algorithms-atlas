import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bstBalance,
  bstFromSorted,
  inorder,
  height,
  isBalanced,
  type BSTNode,
} from '../../src/algorithms/tree/bst-balance/impl.ts';

/** 顺序插入构建退化 BST（右斜链）。 */
function buildDegenerate(values: readonly number[]): BSTNode | null {
  if (values.length === 0) return null;
  const root: BSTNode = { value: values[0]!, left: null, right: null };
  let cur = root;
  for (let i = 1; i < values.length; i++) {
    cur.right = { value: values[i]!, left: null, right: null };
    cur = cur.right;
  }
  return root;
}

test('bst-balance 退化链重建后平衡', () => {
  const root = buildDegenerate([1, 2, 3, 4, 5, 6, 7]);
  assert.equal(isBalanced(root), false); // 退化链不平衡
  const balanced = bstBalance(root);
  assert.equal(isBalanced(balanced), true);
});

test('bst-balance 中序不变（仍是升序）', () => {
  const root = buildDegenerate([1, 2, 3, 4, 5, 6, 7]);
  const balanced = bstBalance(root);
  assert.deepEqual(inorder(balanced), [1, 2, 3, 4, 5, 6, 7]);
});

test('bst-balance 高度降至对数级', () => {
  const root = buildDegenerate([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  const balanced = bstBalance(root);
  // 15 节点的平衡 BST 高度 = 4
  assert.equal(height(balanced), 4);
});

test('bst-balance 根为中位数', () => {
  const root = buildDegenerate([1, 2, 3, 4, 5, 6, 7]);
  const balanced = bstBalance(root);
  assert.equal(balanced!.value, 4); // 中位数
});

test('bst-balance 空树与单节点', () => {
  assert.equal(bstBalance(null), null);
  const single = bstFromSorted([42]);
  assert.equal(single!.value, 42);
});

test('bst-balance 钩子被调用', () => {
  let collects = 0;
  let creates = 0;
  const root = buildDegenerate([1, 2, 3]);
  bstBalance(root, { onCollect: () => collects++, onCreate: () => creates++ });
  assert.equal(collects, 3);
  assert.equal(creates, 3);
});
