import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RBTree } from '../../src/algorithms/ds/ds-rb-impl/impl.ts';

test('LLRB 升序插入保持有序', () => {
  const t = new RBTree();
  for (let i = 1; i <= 15; i++) t.insert(i);
  assert.deepEqual(
    t.inorder(),
    Array.from({ length: 15 }, (_, i) => i + 1),
  );
});

test('LLRB 根为黑', () => {
  const t = new RBTree();
  [5, 3, 8].forEach((v) => t.insert(v));
  assert.equal(t.root!.color, 'BLACK');
});

test('LLRB 查找', () => {
  const t = new RBTree();
  [10, 5, 15, 3, 7].forEach((v) => t.insert(v));
  assert.equal(t.search(7), true);
  assert.equal(t.search(11), false);
});

test('LLRB 重复不插入', () => {
  const t = new RBTree();
  t.insert(5);
  t.insert(5);
  assert.equal(t.size, 1);
});

test('LLRB 大量插入后中序严格递增', () => {
  const t = new RBTree();
  const input = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35];
  input.forEach((v) => t.insert(v));
  const sorted = [...input].sort((a, b) => a - b);
  assert.deepEqual(t.inorder(), sorted);
});
