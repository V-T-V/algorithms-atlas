import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BST, bst, toVizTree } from '../../src/algorithms/ds/bst/impl.ts';

test('bst 中序遍历升序', () => {
  const tree = bst([50, 30, 70, 20, 40, 60, 80, 35, 65]);
  assert.deepEqual(tree.inorder(), [20, 30, 35, 40, 50, 60, 65, 70, 80]);
});

test('bst 查找命中与未命中', () => {
  const tree = bst([50, 30, 70, 20, 40]);
  assert.equal(tree.search(40), true);
  assert.equal(tree.search(50), true); // 根
  assert.equal(tree.search(25), false);
  assert.equal(tree.search(100), false);
});

test('bst 重复值不插入', () => {
  const tree = bst([5, 3, 7]);
  assert.equal(tree.insert(3), false); // 已存在
  assert.equal(tree.insert(9), true);
  assert.deepEqual(tree.inorder(), [3, 5, 7, 9]);
});

test('bst 空树 / 单节点', () => {
  const t = new BST();
  assert.equal(t.search(1), false);
  assert.deepEqual(t.inorder(), []);
  t.insert(42);
  assert.equal(t.search(42), true);
  assert.deepEqual(t.inorder(), [42]);
});

test('bst 顺序插入退化为链表（高度 = n）', () => {
  const tree = bst([1, 2, 3, 4, 5]);
  assert.deepEqual(tree.inorder(), [1, 2, 3, 4, 5]);
  // 根应为 1，每个节点只有右孩子
  assert.equal(tree.root!.value, 1);
  assert.equal(tree.root!.left, null);
  assert.equal(tree.root!.right!.value, 2);
});

test('bst 结构正确（左小右大）', () => {
  const tree = bst([50, 30, 70, 20, 40]);
  assert.equal(tree.root!.value, 50);
  assert.equal(tree.root!.left!.value, 30);
  assert.equal(tree.root!.right!.value, 70);
  assert.equal(tree.root!.left!.left!.value, 20);
  assert.equal(tree.root!.left!.right!.value, 40);
});

test('bst toVizTree 反映结构', () => {
  const tree = bst([50, 30, 70]);
  const viz = toVizTree(tree.root, new Set());
  assert.equal(viz!.value, 50);
  assert.equal(viz!.children!.length, 2);
  assert.equal(viz!.children![0]!.value, 30);
  assert.equal(viz!.children![1]!.value, 70);
});

test('bst 插入钩子被调用', () => {
  const inserts: Array<[number, number | null]> = [];
  let compares = 0;
  bst([50, 30, 70], {
    onInsert: (v, p) => inserts.push([v, p]),
    onCompare: () => compares++,
  });
  assert.deepEqual(inserts[0], [50, null]);
  assert.equal(inserts.length, 3);
  assert.ok(compares >= 2);
});

test('bst 查找钩子 onResult', () => {
  const tree = bst([50, 30, 70]);
  const results: Array<[number, boolean]> = [];
  tree.search(30, { onResult: (v, f) => results.push([v, f]) });
  tree.search(99, { onResult: (v, f) => results.push([v, f]) });
  assert.deepEqual(results, [
    [30, true],
    [99, false],
  ]);
});
