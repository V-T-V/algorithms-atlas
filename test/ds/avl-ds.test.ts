import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AVLTree, avlDs, type AVLDSHooks } from '../../src/algorithms/ds/avl-ds/impl.ts';

test('avlDs 批量插入后中序升序', () => {
  const tree = avlDs([10, 20, 30, 40, 50, 25, 5]);
  assert.deepEqual(tree.toArray(), [5, 10, 20, 25, 30, 40, 50]);
});

test('AVLTree 始终满足平衡性质', () => {
  const tree = new AVLTree();
  for (let i = 1; i <= 100; i++) tree.insert(i);
  assert.equal(tree.isValid(), true);
  // 升序插入后，AVL 高应远小于 n
  assert.ok(tree.height() <= 8, `height ${tree.height()} should be ≤ ~1.44 log n`);
});

test('AVLTree 单元素 / 空', () => {
  const tree = new AVLTree();
  assert.equal(tree.size, 0);
  assert.equal(tree.height(), 0);
  tree.insert(42);
  assert.equal(tree.size, 1);
  assert.equal(tree.search(42), true);
  assert.deepEqual(tree.toArray(), [42]);
});

test('AVLTree 重复值不插入', () => {
  const tree = new AVLTree();
  assert.equal(tree.insert(5), true);
  assert.equal(tree.insert(5), false);
  assert.equal(tree.size, 1);
});

test('AVLTree search', () => {
  const tree = avlDs([10, 20, 30, 40, 50]);
  assert.equal(tree.search(30), true);
  assert.equal(tree.search(25), false);
  assert.equal(tree.search(50), true);
});

test('AVLTree remove 维持平衡与 BST 序', () => {
  const tree = avlDs([10, 20, 30, 40, 50, 25, 5]);
  assert.equal(tree.remove(30), true);
  assert.equal(tree.search(30), false);
  assert.equal(tree.isValid(), true);
  // 中序仍是升序
  const arr = tree.toArray();
  for (let i = 1; i < arr.length; i++) assert.ok(arr[i - 1]! < arr[i]!);
});

test('AVLTree remove 不存在元素返回 false', () => {
  const tree = avlDs([1, 2, 3]);
  assert.equal(tree.remove(99), false);
  assert.equal(tree.size, 3);
});

test('AVLTree 触发 LL / RR / LR / RL 旋转', () => {
  // RR：插入 1,2,3 应触发左旋
  let rotTypes: string[] = [];
  avlDs([1, 2, 3], {
    onRotate: (t) => rotTypes.push(t),
  });
  assert.ok(rotTypes.includes('RR'), `got ${rotTypes}`);

  // LL：插入 3,2,1 应触发右旋
  rotTypes = [];
  avlDs([3, 2, 1], {
    onRotate: (t) => rotTypes.push(t),
  });
  assert.ok(rotTypes.includes('LL'));

  // LR：插入 3,1,2
  rotTypes = [];
  avlDs([3, 1, 2], {
    onRotate: (t) => rotTypes.push(t),
  });
  assert.ok(rotTypes.includes('LR'));

  // RL：插入 1,3,2
  rotTypes = [];
  avlDs([1, 3, 2], {
    onRotate: (t) => rotTypes.push(t),
  });
  assert.ok(rotTypes.includes('RL'));
});

test('AVLTree 钩子被调用', () => {
  let compares = 0;
  let inserts = 0;
  let rotates = 0;
  const hooks: AVLDSHooks = {
    onCompare: () => compares++,
    onInsert: () => inserts++,
    onRotate: () => rotates++,
  };
  avlDs([10, 20, 30], hooks); // 触发 RR
  assert.ok(compares > 0);
  assert.equal(inserts, 3);
  assert.ok(rotates > 0);
});
