import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAA,
  aaInsert,
  aaSearch,
  inorder,
  height,
  isBST,
  isAATree,
} from '../../src/algorithms/tree/aa-tree/impl.ts';

test('aa 顺序插入保持 BST 且中序有序', () => {
  const root = buildAA([1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(inorder(root), [1, 2, 3, 4, 5, 6, 7]);
  assert.ok(isBST(root), '应是合法 BST');
});

test('aa 顺序插入后保持 AA 性质', () => {
  const root = buildAA([10, 4, 20, 2, 6, 15, 30, 1, 3, 5, 8]);
  assert.ok(isAATree(root), '应满足 AA 性质');
  assert.ok(isBST(root), '应是合法 BST');
});

test('aa 顺序插入后树高为 O(log n)', () => {
  const root = buildAA([1, 2, 3, 4, 5, 6, 7]);
  const h = height(root);
  assert.ok(h <= 5, `顺序插入 7 个节点高度应 <= 5，实际 ${h}`);
  assert.ok(h < 7, `不应退化为链（高度 < 7），实际 ${h}`);
});

test('aaSearch 命中与未命中', () => {
  const root = buildAA([10, 5, 15, 3, 7]);
  assert.equal(aaSearch(root, 7), true);
  assert.equal(aaSearch(root, 10), true);
  assert.equal(aaSearch(root, 100), false);
});

test('aaInsert 去重', () => {
  let root = buildAA([5, 3, 7])!;
  const before = inorder(root);
  root = aaInsert(root, 3);
  assert.deepEqual(inorder(root), before);
});

test('aa 钩子被调用', () => {
  let skews = 0;
  let splits = 0;
  buildAA([1, 2, 3, 4, 5], {
    onSkew: () => skews++,
    onSplit: () => splits++,
  });
  assert.ok(skews + splits >= 1, '顺序插入应至少触发一次 skew 或 split');
});

test('aa 空树与单节点', () => {
  assert.equal(buildAA([]), null);
  assert.deepEqual(inorder(buildAA([42])), [42]);
});
