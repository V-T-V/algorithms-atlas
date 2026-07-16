import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  rotateRight,
  rotateLeft,
  buildAVL,
  inorder,
  height,
  balanceFactor,
  AvlNode,
} from '../../src/algorithms/tree/tree-avl-rotation/impl.ts';

test('右旋保持 BST 性质', () => {
  //    y(3)
  //   /
  //  x(2)
  // /
  // a(1)
  const a = new AvlNode(1);
  const x = new AvlNode(2, a, null);
  const y = new AvlNode(3, x, null);
  const r = rotateRight(y);
  assert.equal(r.value, 2);
  assert.equal(r.left!.value, 1);
  assert.equal(r.right!.value, 3);
});

test('左旋保持 BST 性质', () => {
  const c = new AvlNode(3);
  const y = new AvlNode(2, null, c);
  const x = new AvlNode(1, null, y);
  const r = rotateLeft(x);
  assert.equal(r.value, 2);
  assert.equal(r.left!.value, 1);
  assert.equal(r.right!.value, 3);
});

test('插入升序仍平衡（RR 旋转）', () => {
  const root = buildAVL([1, 2, 3]);
  assert.equal(height(root), 2);
  assert.deepEqual(inorder(root), [1, 2, 3]);
  // 根应为 2
  assert.equal(root!.value, 2);
});

test('插入降序仍平衡（LL 旋转）', () => {
  const root = buildAVL([3, 2, 1]);
  assert.equal(height(root), 2);
  assert.equal(root!.value, 2);
});

test('LR 旋转', () => {
  // 3, 1, 2 → LR
  const root = buildAVL([3, 1, 2]);
  assert.equal(height(root), 2);
  assert.equal(root!.value, 2);
  assert.deepEqual(inorder(root), [1, 2, 3]);
});

test('RL 旋转', () => {
  // 1, 3, 2 → RL
  const root = buildAVL([1, 3, 2]);
  assert.equal(height(root), 2);
  assert.equal(root!.value, 2);
});

test('所有节点平衡因子在 [-1, 1]', () => {
  const root = buildAVL([10, 20, 30, 40, 50, 25, 5, 15]);
  const check = (n: AvlNode | null): boolean => {
    if (n === null) return true;
    const bf = balanceFactor(n);
    return bf >= -1 && bf <= 1 && check(n.left) && check(n.right);
  };
  assert.ok(check(root));
});

test('高度 log 级', () => {
  const keys = Array.from({ length: 15 }, (_, i) => i + 1);
  const root = buildAVL(keys);
  // 15 个节点平衡 BST 高度应为 4
  assert.equal(height(root), 4);
});

test('回调触发', () => {
  let rotations = 0;
  buildAVL([1, 2, 3], { onRotate: () => rotations++ });
  assert.ok(rotations >= 1);
});

test('重复键不插入', () => {
  const root = buildAVL([5, 5, 5]);
  assert.deepEqual(inorder(root), [5]);
});
