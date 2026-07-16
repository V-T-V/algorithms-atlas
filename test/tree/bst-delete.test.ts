import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bstDelete, bstInsert, inorder } from '../../src/algorithms/tree/bst-delete/impl.ts';

test('bst-delete 叶子节点', () => {
  //        5
  //       / \
  //      3   7
  //     /
  //    1
  const root = bstInsert([5, 3, 7, 1]);
  const r = bstDelete(root, 1);
  assert.equal(r.deleted, true);
  assert.deepEqual(inorder(r.root), [3, 5, 7]);
});

test('bst-delete 单子节点', () => {
  //        5
  //       / \
  //      3   7
  //     /
  //    1          删 3 后 1 顶替
  const root = bstInsert([5, 3, 7, 1]);
  const r = bstDelete(root, 3);
  assert.equal(r.deleted, true);
  assert.deepEqual(inorder(r.root), [1, 5, 7]);
});

test('bst-delete 双子节点（用中序后继替换）', () => {
  //        5
  //       / \
  //      3   7
  //     / \   \
  //    1   4   8     删 5 → 后继 7 顶替
  const root = bstInsert([5, 3, 7, 1, 4, 8]);
  const r = bstDelete(root, 5);
  assert.equal(r.deleted, true);
  assert.deepEqual(inorder(r.root), [1, 3, 4, 7, 8]);
  assert.equal(r.root!.value, 7); // 后继成为新根
});

test('bst-delete 删除根（仅根）', () => {
  const root = bstInsert([42]);
  const r = bstDelete(root, 42);
  assert.equal(r.deleted, true);
  assert.equal(r.root, null);
});

test('bst-delete 删除不存在的值', () => {
  const root = bstInsert([5, 3, 7]);
  const r = bstDelete(root, 100);
  assert.equal(r.deleted, false);
  assert.deepEqual(inorder(r.root), [3, 5, 7]);
});

test('bst-delete 钩子触发正确情况', () => {
  const cases: string[] = [];
  const root = bstInsert([5, 3, 7, 1, 4, 8]);
  bstDelete(root, 5, { onFound: (_v, c) => cases.push(c) });
  assert.ok(cases.includes('two-children'));
});
