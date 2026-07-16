import { test } from 'node:test';
import assert from 'node:assert/strict';
import { postorderIter, buildTree } from '../../src/algorithms/tree/tree-postorder-iter/impl.ts';

test('postorderIter 后序序列', () => {
  const root = buildTree([4, 2, 6, 1, 3, 5, 7]);
  assert.deepEqual(postorderIter(root), [1, 3, 2, 5, 7, 6, 4]);
});

test('postorderIter 边界', () => {
  assert.deepEqual(postorderIter(null), []);
  assert.deepEqual(postorderIter(buildTree([1])), [1]);
  assert.deepEqual(postorderIter(buildTree([1, 2, 3])), [2, 3, 1]);
});

test('postorderIter 与递归一致', () => {
  const root = buildTree([1, 2, 3, null, 4, 5]);
  const rec: number[] = [];
  const walk = (n: typeof root): void => {
    if (!n) return;
    walk(n.left);
    walk(n.right);
    rec.push(n.value);
  };
  walk(root);
  assert.deepEqual(postorderIter(root), rec);
});
