import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bTree, inorder, isValidBTree } from '../../src/algorithms/tree/b-tree/impl.ts';

test('B-tree 插入后中序为升序', () => {
  const tree = bTree([10, 20, 5, 6, 12, 30, 7, 17, 3, 1, 25, 40, 15, 22]);
  assert.deepEqual(inorder(tree.root), [1, 3, 5, 6, 7, 10, 12, 15, 17, 20, 22, 25, 30, 40]);
});

test('B-tree 插入后满足 B 树性质（平衡、度数）', () => {
  const tree = bTree([10, 20, 5, 6, 12, 30, 7, 17, 3, 1, 25, 40, 15, 22]);
  assert.equal(isValidBTree(tree), true);
});

test('B-tree 顺序插入仍平衡（易触发分裂）', () => {
  const vals = Array.from({ length: 50 }, (_, i) => i + 1);
  const tree = bTree(vals);
  assert.equal(isValidBTree(tree), true);
  assert.deepEqual(inorder(tree.root), vals);
});

test('B-tree 逆序插入仍平衡', () => {
  const vals = Array.from({ length: 50 }, (_, i) => 50 - i);
  const tree = bTree(vals);
  assert.equal(isValidBTree(tree), true);
  assert.deepEqual(
    inorder(tree.root),
    vals.sort((a, b) => a - b),
  );
});

test('B-tree 重复值仍保留（多副本）', () => {
  // 本实现不去重，重复值作为独立关键字插入
  const tree = bTree([5, 5, 5, 1, 1]);
  assert.deepEqual(inorder(tree.root), [1, 1, 5, 5, 5]);
  assert.equal(isValidBTree(tree), true);
});

test('B-tree 搜索正确', () => {
  const tree = bTree([10, 20, 5, 6, 12, 30, 7, 17, 3]);
  assert.equal(tree.search(17), true);
  assert.equal(tree.search(10), true);
  assert.equal(tree.search(3), true);
  assert.equal(tree.search(99), false);
  assert.equal(tree.search(8), false);
});

test('B-tree t=3 时仍合法', () => {
  const vals = Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000));
  const tree = bTree(vals, 3);
  assert.equal(isValidBTree(tree), true);
  const sorted = [...vals].sort((a, b) => a - b);
  assert.deepEqual(inorder(tree.root), sorted);
});

test('B-tree 空输入返回 null 根', () => {
  const tree = bTree([]);
  assert.equal(tree.root, null);
  assert.equal(isValidBTree(tree), true);
  assert.deepEqual(inorder(tree.root), []);
});

test('B-tree 单元素', () => {
  const tree = bTree([42]);
  assert.equal(isValidBTree(tree), true);
  assert.deepEqual(inorder(tree.root), [42]);
  assert.equal(tree.search(42), true);
  assert.equal(tree.search(1), false);
});

test('B-tree 大规模随机插入合法且有序', () => {
  const vals = Array.from({ length: 500 }, () => Math.floor(Math.random() * 10000));
  const tree = bTree(vals, 2);
  assert.equal(isValidBTree(tree), true);
  const sorted = [...vals].sort((a, b) => a - b);
  assert.deepEqual(inorder(tree.root), sorted);
  // 每个值都应可搜到
  for (const v of vals) assert.equal(tree.search(v), true);
});

test('B-tree 分裂钩子被调用', () => {
  let splits = 0;
  let promotes = 0;
  // t=2，maxKeys=3；插入 4 个值必然触发至少一次分裂
  bTree([1, 2, 3, 4], 2, {
    onSplit: () => splits++,
    onPromote: () => promotes++,
  });
  assert.ok(splits >= 1, `应至少分裂一次，实际 ${splits}`);
  assert.ok(promotes >= 1, `应至少上推一次，实际 ${promotes}`);
});

test('B-tree 钩子被调用', () => {
  let inserts = 0;
  let inserted = 0;
  bTree([5, 2, 8], 2, {
    onInsert: () => inserts++,
    onInserted: () => inserted++,
  });
  assert.equal(inserts, 3);
  assert.equal(inserted, 3);
});
