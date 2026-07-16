import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSBT,
  sbtInsert,
  sbtSearch,
  kth,
  inorder,
  height,
  checkSizes,
} from '../../src/algorithms/tree/sbt-tree/impl.ts';

test('sbt 顺序插入保持 BST 且中序有序', () => {
  const root = buildSBT([1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(inorder(root), [1, 2, 3, 4, 5, 6, 7]);
  assert.ok(checkSizes(root), 'size 字段应正确');
});

test('sbt 顺序插入后树高为 O(log n)', () => {
  const root = buildSBT([1, 2, 3, 4, 5, 6, 7]);
  const h = height(root);
  assert.ok(h <= 5, `顺序插入 7 个节点高度应 <= 5，实际 ${h}`);
  assert.ok(h < 7, `不应退化为链（高度 < 7），实际 ${h}`);
});

test('sbtSearch 命中与未命中', () => {
  const root = buildSBT([10, 5, 15, 3, 7]);
  assert.equal(sbtSearch(root, 7), true);
  assert.equal(sbtSearch(root, 10), true);
  assert.equal(sbtSearch(root, 100), false);
});

test('kth 查询第 k 小', () => {
  const root = buildSBT([50, 30, 70, 20, 40, 60, 80]);
  assert.equal(kth(root, 1), 20);
  assert.equal(kth(root, 4), 50);
  assert.equal(kth(root, 7), 80);
  assert.equal(kth(root, 0), null);
  assert.equal(kth(root, 8), null);
});

test('sbtInsert 去重', () => {
  let root = buildSBT([5, 3, 7])!;
  const before = inorder(root);
  root = sbtInsert(root, 3);
  assert.deepEqual(inorder(root), before);
});

test('sbt 钩子被调用', () => {
  let rotates = 0;
  buildSBT([1, 2, 3, 4, 5], {
    onRotate: () => rotates++,
  });
  assert.ok(rotates >= 1, '顺序插入应至少旋转一次');
});

test('sbt 空树与单节点', () => {
  assert.equal(buildSBT([]), null);
  assert.deepEqual(inorder(buildSBT([42])), [42]);
  assert.equal(kth(buildSBT([42]), 1), 42);
});
