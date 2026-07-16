import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  rotateLeft,
  rotateRight,
  insert,
  buildTreap,
  inorder,
  height,
  isHeapOrdered,
  isBST,
  makePRNG,
  TreapNode,
} from '../../src/algorithms/tree/tree-treap-rotate/impl.ts';

test('右旋', () => {
  const y = new TreapNode(3, 0, new TreapNode(2, 0, new TreapNode(1, 0)), null);
  const r = rotateRight(y);
  assert.equal(r.key, 2);
});

test('左旋', () => {
  const x = new TreapNode(1, 0, null, new TreapNode(2, 0, null, new TreapNode(3, 0)));
  const r = rotateLeft(x);
  assert.equal(r.key, 2);
});

test('插入后保持 BST 与堆性质', () => {
  const root = buildTreap([
    { key: 50, priority: 7 },
    { key: 30, priority: 3 },
    { key: 70, priority: 11 },
    { key: 20, priority: 1 },
    { key: 40, priority: 5 },
  ]);
  assert.ok(isBST(root));
  assert.ok(isHeapOrdered(root));
  assert.deepEqual(inorder(root), [20, 30, 40, 50, 70]);
});

test('最低优先级在根', () => {
  const root = buildTreap([
    { key: 50, priority: 7 },
    { key: 30, priority: 3 },
    { key: 70, priority: 11 },
    { key: 20, priority: 1 },
  ]);
  assert.equal(root!.priority, 1);
  assert.equal(root!.key, 20);
});

test('旋转触发：新插入的小优先级上浮', () => {
  let rot = 0;
  const root = insert(new TreapNode(10, 5), 5, 1, { onRotate: () => rot++ });
  assert.ok(rot >= 1);
  assert.equal(root!.key, 5);
});

test('makePRNG 确定性', () => {
  const a = makePRNG(42);
  const b = makePRNG(42);
  assert.deepEqual([a(), a(), a()], [b(), b(), b()]);
});

test('随机优先级下形状平衡（高度 ≤ 4·log n）', () => {
  const rng = makePRNG(7);
  const n = 64;
  const entries = Array.from({ length: n }, (_, i) => ({
    key: i + 1,
    priority: rng(),
  }));
  const root = buildTreap(entries);
  assert.ok(isBST(root));
  assert.ok(isHeapOrdered(root));
  const h = height(root);
  // 期望高度约 2.5 ln n ≈ 10.4，宽松上界 4·log₂ n
  assert.ok(h <= 4 * Math.log2(n + 1), `h=${h}`);
});

test('重复键被忽略', () => {
  const root = buildTreap([
    { key: 5, priority: 0.5 },
    { key: 5, priority: 0.1 },
  ]);
  assert.deepEqual(inorder(root), [5]);
});

test('升序键 + 递增优先级 → 退化链', () => {
  // 升序 key 且 priority 也升序，则不会发生旋转，应得退化右链
  const root = buildTreap([
    { key: 1, priority: 1 },
    { key: 2, priority: 2 },
    { key: 3, priority: 3 },
  ]);
  assert.equal(root!.key, 1);
  assert.equal(height(root), 3);
});

test('升序键 + 递减优先级 → 完全左偏链', () => {
  // priority 反向，每次插入都会触发旋转把新根设为最新键
  const root = buildTreap([
    { key: 1, priority: 5 },
    { key: 2, priority: 4 },
    { key: 3, priority: 3 },
  ]);
  assert.equal(root!.key, 3);
  assert.ok(isBST(root));
  assert.ok(isHeapOrdered(root));
});
