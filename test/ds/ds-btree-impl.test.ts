import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BTree } from '../../src/algorithms/ds/ds-btree-impl/impl.ts';

test('B 树 t=2 升序插入保持有序', () => {
  const t = new BTree(2);
  for (let i = 1; i <= 20; i++) t.insert(i);
  assert.deepEqual(
    t.inorder(),
    Array.from({ length: 20 }, (_, i) => i + 1),
  );
});

test('B 树 t=3 乱序插入有序', () => {
  const t = new BTree(3);
  const input = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35];
  input.forEach((v) => t.insert(v));
  const sorted = [...input].sort((a, b) => a - b);
  assert.deepEqual(t.inorder(), sorted);
});

test('B 树查找', () => {
  const t = new BTree(2);
  [5, 3, 8, 1, 4, 9, 10].forEach((v) => t.insert(v));
  assert.equal(t.search(4), true);
  assert.equal(t.search(7), false);
  assert.equal(t.search(10), true);
});

test('B 树根节点分裂后高度增加', () => {
  const t = new BTree(2);
  // t=2 → 节点最多 3 keys；插入 1,2,3,4 触发根分裂
  [1, 2, 3, 4, 5, 6, 7].forEach((v) => t.insert(v));
  // 根应非叶
  assert.equal(t.root.leaf, false);
});

test('B 树无重复限制（允许同值）', () => {
  const t = new BTree(2);
  t.insert(5);
  t.insert(5);
  assert.equal(t.size, 2);
});
