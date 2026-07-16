import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  rotateLeft,
  rotateRight,
  splay,
  insert,
  search,
  buildSplay,
  inorder,
  height,
  SplayNode,
} from '../../src/algorithms/tree/tree-splay-zig/impl.ts';

test('右旋把左儿子提到根', () => {
  const y = new SplayNode(3, new SplayNode(2, new SplayNode(1)), null);
  const r = rotateRight(y);
  assert.equal(r.value, 2);
});

test('左旋把右儿子提到根', () => {
  const x = new SplayNode(1, null, new SplayNode(2, null, new SplayNode(3)));
  const r = rotateLeft(x);
  assert.equal(r.value, 2);
});

test('splay 把已存在的 key 移到根', () => {
  // 退化链 1 ← 2 ← 3（每节点右儿子）
  const root = new SplayNode(1, null, new SplayNode(2, null, new SplayNode(3)));
  const r = splay(root, 3)!;
  assert.equal(r.value, 3);
  assert.deepEqual(inorder(r), [1, 2, 3]);
});

test('splay 不存在的 key（最近邻在根）', () => {
  const root = new SplayNode(5, new SplayNode(3), new SplayNode(8));
  const r = splay(root, 4)!;
  // 4 不存在；应把最接近的（3 或 5）放到根
  assert.ok(r.value === 3 || r.value === 5);
});

test('search 命中返回节点', () => {
  const root = buildSplay([10, 20, 30, 40]);
  const found = search(root, 30);
  assert.notEqual(found, null);
  assert.equal(found!.value, 30);
});

test('search 未命中返回 null', () => {
  const root = buildSplay([10, 20, 30]);
  assert.equal(search(root, 99), null);
});

test('insert 把新节点放根', () => {
  const root = buildSplay([5, 10, 15]);
  const r = insert(root, 1);
  assert.equal(r.value, 1);
  assert.deepEqual(
    inorder(r).sort((a, b) => a - b),
    [1, 5, 10, 15],
  );
});

test('中序为 BST 顺序', () => {
  const root = buildSplay([7, 3, 9, 1, 5, 12, 10]);
  assert.deepEqual(inorder(root), [1, 3, 5, 7, 9, 10, 12]);
});

test('回调触发', () => {
  let steps = 0;
  // 退化链：访问最深层一定触发 zig-zig/zig-zag
  const root = new SplayNode(1, null, new SplayNode(2, null, new SplayNode(3)));
  splay(root, 3, { onStep: () => steps++ });
  assert.ok(steps >= 1);
});

test('多次访问降低高度（局部性）', () => {
  // 升序插入形成退化链
  let root: SplayNode | null = null;
  for (const k of [1, 2, 3, 4, 5]) root = insert(root, k);
  const h0 = height(root);
  // 访问 1 后再访问 1
  root = search(root, 1);
  root = search(root, 1);
  const h1 = height(root);
  assert.equal(root!.value, 1);
  // 高度应下降或保持
  assert.ok(h1 <= h0);
});
