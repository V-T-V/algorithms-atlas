import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTreap,
  treapInsert,
  treapDelete,
  treapSearch,
  inorder,
  height,
  isTreap,
  resetSeed,
  type TreapNode,
} from '../../src/algorithms/ds/treap-ds/impl.ts';

test('treap 顺序插入保持 BST 且中序有序', () => {
  resetSeed(20240601);
  const root = buildTreap([1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(inorder(root), [1, 2, 3, 4, 5, 6, 7]);
  assert.ok(isTreap(root), '应是合法 Treap');
});

test('treap 顺序插入后树高 O(log n)', () => {
  resetSeed(20240601);
  const root = buildTreap([1, 2, 3, 4, 5, 6, 7]);
  const h = height(root);
  assert.ok(h <= 7, `顺序插入 7 个节点高度应 <= 7，实际 ${h}`);
  // 随机优先级应使树较平衡
  assert.ok(h < 7, `随机 Treap 高度应 < 7，实际 ${h}`);
});

test('treapSearch 命中与未命中', () => {
  resetSeed(20240601);
  const root = buildTreap([10, 5, 15, 3, 7]);
  assert.equal(treapSearch(root, 7), true);
  assert.equal(treapSearch(root, 10), true);
  assert.equal(treapSearch(root, 100), false);
});

test('treapInsert 去重', () => {
  resetSeed(20240601);
  let root = buildTreap([5, 3, 7])!;
  const before = inorder(root);
  root = treapInsert(root, 3);
  assert.deepEqual(inorder(root), before);
});

test('treapDelete 删除节点后仍为合法 Treap', () => {
  resetSeed(20240601);
  let root: TreapNode | null = buildTreap([5, 3, 8, 1, 4, 7, 9]);
  root = treapDelete(root, 3);
  assert.deepEqual(inorder(root), [1, 4, 5, 7, 8, 9]);
  assert.ok(isTreap(root), '删除后仍应为合法 Treap');
  root = treapDelete(root, 5);
  assert.deepEqual(inorder(root), [1, 4, 7, 8, 9]);
  assert.ok(isTreap(root), '删除根后仍应为合法 Treap');
});

test('treapDelete 删除不存在的 key 不影响', () => {
  resetSeed(20240601);
  let root: TreapNode | null = buildTreap([1, 2, 3]);
  const before = inorder(root);
  root = treapDelete(root, 100);
  assert.deepEqual(inorder(root), before);
});

test('treap 钩子被调用', () => {
  resetSeed(20240601);
  let rotates = 0;
  buildTreap([1, 2, 3, 4, 5], {
    onRotate: () => rotates++,
  });
  assert.ok(rotates >= 1, '顺序插入应至少旋转一次');
});

test('treap 空树与单节点', () => {
  resetSeed(20240601);
  assert.equal(buildTreap([]), null);
  assert.deepEqual(inorder(buildTreap([42])), [42]);
});

test('treap 大规模随机验证 BST + 堆性质', () => {
  resetSeed(12345);
  const keys = Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000));
  const root = buildTreap(keys);
  assert.ok(isTreap(root), '大规模随机插入后应满足 BST + 堆序');
  const sorted = inorder(root);
  const ref = [...new Set(keys)].sort((a, b) => a - b);
  assert.deepEqual(sorted, ref);
});
