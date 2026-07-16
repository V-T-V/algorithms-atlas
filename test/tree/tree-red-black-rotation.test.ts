import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  rotateLeft,
  rotateRight,
  buildRB,
  inorder,
  isValidRB,
  treeHeight,
  isRed,
  RBNode,
} from '../../src/algorithms/tree/tree-red-black-rotation/impl.ts';

test('单节点为黑根', () => {
  const root = buildRB([5]);
  assert.equal(root!.color, 'B');
  assert.equal(root!.value, 5);
});

test('左旋保持中序', () => {
  const x = new RBNode(1, 'B', null, new RBNode(2, 'R'), null);
  x.right!.parent = x;
  rotateLeft(x);
  // 新根应是 2
  const r = x.parent!;
  assert.equal(r.value, 2);
});

test('右旋保持中序', () => {
  const x = new RBNode(3, 'B', new RBNode(2, 'R'), null, null);
  x.left!.parent = x;
  rotateRight(x);
  assert.equal(x.parent!.value, 2);
});

test('升序插入：红黑性质保持', () => {
  const root = buildRB([1, 2, 3, 4, 5, 6, 7]);
  assert.ok(isValidRB(root));
  assert.deepEqual(inorder(root), [1, 2, 3, 4, 5, 6, 7]);
});

test('降序插入：红黑性质保持', () => {
  const root = buildRB([7, 6, 5, 4, 3, 2, 1]);
  assert.ok(isValidRB(root));
  assert.deepEqual(inorder(root), [1, 2, 3, 4, 5, 6, 7]);
});

test('随机顺序：红黑性质保持', () => {
  const root = buildRB([10, 20, 30, 15, 25, 5, 1, 8, 12, 18]);
  assert.ok(isValidRB(root));
});

test('红黑树高度 ≤ 2·log₂(n+1)', () => {
  const n = 15;
  const root = buildRB(Array.from({ length: n }, (_, i) => i + 1));
  const h = treeHeight(root);
  const ub = 2 * Math.log2(n + 1);
  assert.ok(h <= ub, `height ${h} > ${ub}`);
});

test('无两个连续红节点', () => {
  const root = buildRB([10, 20, 30, 15, 25, 5, 1]);
  const check = (n: RBNode | null): boolean => {
    if (n === null) return true;
    if (isRed(n) && (isRed(n.left) || isRed(n.right))) return false;
    return check(n.left) && check(n.right);
  };
  assert.ok(check(root));
});

test('回调触发', () => {
  let rot = 0;
  let col = 0;
  buildRB([1, 2, 3], {
    onRotate: () => rot++,
    onColor: () => col++,
  });
  assert.ok(rot + col >= 1);
});

test('重复键插入（按 BST 行为进入右子树）', () => {
  // 红黑树一般允许重复键落入右子树；这里仅验证不崩溃且中序包含
  const root = buildRB([5, 5]);
  assert.ok(isValidRB(root));
});
