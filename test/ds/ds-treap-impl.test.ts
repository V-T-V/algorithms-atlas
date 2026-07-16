import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Treap } from '../../src/algorithms/ds/ds-treap-impl/impl.ts';

test('treap 升序插入保持中序有序', () => {
  const t = new Treap();
  for (let i = 1; i <= 20; i++) t.insert(i);
  assert.deepEqual(
    t.inorder(),
    Array.from({ length: 20 }, (_, i) => i + 1),
  );
});

test('treap 堆性质成立', () => {
  const t = new Treap();
  for (let i = 1; i <= 50; i++) t.insert(i);
  assert.equal(t.checkHeap(), true);
});

test('treap 查找', () => {
  const t = new Treap();
  [10, 5, 15, 3, 7, 12].forEach((v) => t.insert(v));
  assert.equal(t.search(7), true);
  assert.equal(t.search(8), false);
});

test('treap 重复不插入', () => {
  const t = new Treap();
  t.insert(5);
  t.insert(5);
  assert.equal(t.size, 1);
});

test('treap 乱序插入有序', () => {
  const t = new Treap();
  [50, 30, 70, 20, 40, 60, 80].forEach((v) => t.insert(v));
  assert.deepEqual(t.inorder(), [20, 30, 40, 50, 60, 70, 80]);
});
