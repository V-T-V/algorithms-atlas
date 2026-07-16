import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inorderIter, buildTree } from '../../src/algorithms/tree/tree-inorder-iter/impl.ts';

test('inorderIter 中序序列', () => {
  const root = buildTree([4, 2, 6, 1, 3, 5, 7]);
  assert.deepEqual(inorderIter(root), [1, 2, 3, 4, 5, 6, 7]);
});

test('inorderIter 边界', () => {
  assert.deepEqual(inorderIter(null), []);
  assert.deepEqual(inorderIter(buildTree([1])), [1]);
});

test('inorderIter BST 升序', () => {
  const root = buildTree([5, 3, 8, 1, 4, 7, 9]);
  const out = inorderIter(root);
  for (let i = 1; i < out.length; i++) assert.ok(out[i - 1]! < out[i]!);
});

test('inorderIter 与递归一致', () => {
  const root = buildTree([1, 2, 3, null, 4]);
  const rec: number[] = [];
  const walk = (n: typeof root): void => {
    if (!n) return;
    walk(n.left);
    rec.push(n.value);
    walk(n.right);
  };
  walk(root);
  assert.deepEqual(inorderIter(root), rec);
});

test('inorderIter 钩子 push/pop/visit', () => {
  const visits: number[] = [];
  inorderIter(buildTree([1, 2, 3]), { onVisit: (v) => visits.push(v) });
  assert.deepEqual(visits, [2, 1, 3]);
});
