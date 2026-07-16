import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildScapegoat,
  scapegoatInsert,
  scapegoatSearch,
  inorder,
  height,
  isBST,
} from '../../src/algorithms/tree/scapegoat-tree-impl/impl.ts';

test('scapegoat 顺序插入保持 BST 且中序有序', () => {
  const root = buildScapegoat([1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(inorder(root), [1, 2, 3, 4, 5, 6, 7]);
  assert.ok(isBST(root), '应是合法 BST');
});

test('scapegoat 顺序插入后树高为 O(log n)（不会退化为链）', () => {
  const root = buildScapegoat([1, 2, 3, 4, 5, 6, 7]);
  // 7 个节点的完美平衡高度 = 3，替罪羊允许略松但应远小于 7
  const h = height(root);
  assert.ok(h <= 4, `顺序插入 7 个节点高度应 <= 4，实际 ${h}`);
  assert.ok(h >= 3, `高度应 >= 3（满树），实际 ${h}`);
});

test('scapegoatSearch 命中与未命中', () => {
  const root = buildScapegoat([10, 5, 15, 3, 7]);
  assert.equal(scapegoatSearch(root, 7), true);
  assert.equal(scapegoatSearch(root, 10), true);
  assert.equal(scapegoatSearch(root, 100), false);
});

test('scapegoatInsert 去重', () => {
  let root = buildScapegoat([5, 3, 7])!;
  const before = inorder(root);
  root = scapegoatInsert(root, 3);
  assert.deepEqual(inorder(root), before); // 重复不插入
});

test('scapegoat 钩子被调用', () => {
  let scapegoats = 0;
  let rebuilds = 0;
  buildScapegoat([1, 2, 3, 4, 5, 6, 7], {
    onScapegoat: () => scapegoats++,
    onRebuild: () => rebuilds++,
  });
  assert.ok(scapegoats >= 1, '顺序插入应至少触发一次替罪羊');
  assert.ok(rebuilds >= 1, '应至少重建一次');
});

test('scapegoat 空树与单节点', () => {
  assert.equal(buildScapegoat([]), null);
  assert.deepEqual(inorder(buildScapegoat([42])), [42]);
});
