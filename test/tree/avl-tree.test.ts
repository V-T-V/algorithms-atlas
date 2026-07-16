import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  avlInsert,
  inorder,
  isAVL,
  type AVLHooks,
} from '../../src/algorithms/tree/avl-tree/impl.ts';

test('AVL 插入后中序为升序', () => {
  const root = avlInsert([10, 20, 30, 40, 50, 25]);
  assert.deepEqual(inorder(root), [10, 20, 25, 30, 40, 50]);
});

test('AVL 插入后满足平衡性质', () => {
  const root = avlInsert([10, 20, 30, 40, 50, 25]);
  assert.equal(isAVL(root), true);
});

test('AVL 顺序插入仍保持平衡（最易失衡场景）', () => {
  const root = avlInsert([1, 2, 3, 4, 5, 6, 7]);
  assert.equal(isAVL(root), true);
  assert.deepEqual(inorder(root), [1, 2, 3, 4, 5, 6, 7]);
});

test('AVL 重复值不插入', () => {
  const root = avlInsert([5, 5, 5]);
  assert.deepEqual(inorder(root), [5]);
});

test('AVL 空输入返回 null', () => {
  assert.equal(avlInsert([]), null);
});

test('AVL 旋转钩子被调用', () => {
  let rotations = 0;
  const hooks: AVLHooks = {
    onRotate: () => rotations++,
  };
  // 1,2,3 顺序插入必然触发 RR 左旋
  avlInsert([1, 2, 3], hooks);
  assert.ok(rotations > 0, '应触发至少一次旋转');
});

test('AVL 高度对数增长', () => {
  // 插入 31 个升序元素，AVL 高度应远小于 31（约 5）
  const vals = Array.from({ length: 31 }, (_, i) => i + 1);
  const root = avlInsert(vals);
  assert.equal(isAVL(root), true);
  // 31 节点的 AVL 高度上界约 ⌊1.44 log2(32)⌋ ≈ 7
  const h = (function height(n: NonNullable<typeof root>): number {
    return 1 + Math.max(n.left ? height(n.left) : 0, n.right ? height(n.right) : 0);
  })(root!);
  assert.ok(h <= 8, `高度 ${h} 应 ≤ 8（对数级），而非线性 31`);
});
