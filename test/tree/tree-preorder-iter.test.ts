import { test } from 'node:test';
import assert from 'node:assert/strict';
import { preorderIter, buildTree } from '../../src/algorithms/tree/tree-preorder-iter/impl.ts';

test('preorderIter 前序序列', () => {
  const root = buildTree([4, 2, 6, 1, 3, 5, 7]);
  assert.deepEqual(preorderIter(root), [4, 2, 1, 3, 6, 5, 7]);
});

test('preorderIter 边界', () => {
  assert.deepEqual(preorderIter(null), []);
  assert.deepEqual(preorderIter(buildTree([1])), [1]);
  assert.deepEqual(preorderIter(buildTree([1, 2, 3])), [1, 2, 3]);
});

test('preorderIter 与递归一致', () => {
  // 构造一棵非完全树
  const root = buildTree([1, 2, 3, null, 4, 5, null, null, null, 6]);
  // 手动递归前序
  const rec: number[] = [];
  const walk = (n: typeof root): void => {
    if (!n) return;
    rec.push(n.value);
    walk(n.left);
    walk(n.right);
  };
  walk(root);
  assert.deepEqual(preorderIter(root), rec);
});

test('preorderIter 钩子：栈 push/pop 与 visit', () => {
  const pushes: number[] = [];
  const pops: number[] = [];
  const visits: number[] = [];
  preorderIter(buildTree([1, 2, 3]), {
    onPush: (v) => pushes.push(v),
    onPop: (v) => pops.push(v),
    onVisit: (v) => visits.push(v),
  });
  assert.deepEqual(pushes, [1, 3, 2]); // 根、右、左
  assert.deepEqual(pops, [1, 2, 3]); // 访问顺序
  assert.deepEqual(visits, [1, 2, 3]);
});
