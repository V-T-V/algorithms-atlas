import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AVLTree } from '../../src/algorithms/ds/ds-avl-impl/impl.ts';

test('AVL 插入升序后中序有序', () => {
  const t = new AVLTree();
  for (const v of [1, 2, 3, 4, 5, 6, 7]) t.insert(v);
  assert.deepEqual(t.inorder(), [1, 2, 3, 4, 5, 6, 7]);
});

test('AVL 升序插入仍保持平衡（高度 ≤ 1.44 log n）', () => {
  const t = new AVLTree();
  for (let i = 1; i <= 15; i++) t.insert(i);
  assert.equal(t.root!.height, 4); // 15 个节点，AVL 高度恰好 4
});

test('AVL 查找', () => {
  const t = new AVLTree();
  [5, 3, 8, 1, 4].forEach((v) => t.insert(v));
  assert.equal(t.search(4), true);
  assert.equal(t.search(7), false);
  assert.equal(t.search(1), true);
});

test('AVL 重复插入不增加规模', () => {
  const t = new AVLTree();
  t.insert(5);
  t.insert(5);
  assert.equal(t.size, 1);
});

test('AVL LL 触发旋转', () => {
  const t = new AVLTree();
  let rotations = 0;
  t.insert(3, { onRotate: () => rotations++ });
  t.insert(2, { onRotate: () => rotations++ });
  t.insert(1, { onRotate: () => rotations++ });
  assert.equal(t.root!.value, 2); // 触发 LL 后根变为 2
  assert.ok(rotations >= 1);
});
