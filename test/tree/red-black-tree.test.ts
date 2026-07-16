import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  redBlackTree,
  RedBlackTree,
  inorder,
  isRedBlackTree,
} from '../../src/algorithms/tree/red-black-tree/impl.ts';

test('red-black-tree 中序遍历升序', () => {
  const tree = redBlackTree([10, 20, 30, 15, 25, 5, 1]);
  assert.deepEqual(inorder(tree.root), [1, 5, 10, 15, 20, 25, 30]);
});

test('red-black-tree 根始终为黑', () => {
  for (const vals of [[10], [10, 20], [10, 20, 30], [5, 3, 7, 1, 9]]) {
    const tree = redBlackTree(vals);
    assert.equal(tree.root!.color, 'BLACK', `插入 ${vals.join(',')} 后根应为黑`);
  }
});

test('red-black-tree 满足红黑性质（插入后）', () => {
  const tree = redBlackTree([10, 20, 30, 15, 25, 5, 1, 2, 3, 4, 8, 12, 18]);
  const res = isRedBlackTree(tree);
  assert.equal(res.ok, true, res.reason ?? '应满足红黑性质');
});

test('red-black-tree 升序插入仍平衡（无相邻红、黑高一致）', () => {
  // 升序 1..20 是最易失衡的序列
  const tree = redBlackTree(Array.from({ length: 20 }, (_, i) => i + 1));
  const res = isRedBlackTree(tree);
  assert.equal(res.ok, true, res.reason ?? '升序插入后仍应平衡');
  assert.deepEqual(
    inorder(tree.root),
    Array.from({ length: 20 }, (_, i) => i + 1),
  );
});

test('red-black-tree 重复值不插入', () => {
  const tree = redBlackTree([5, 5, 5]);
  assert.deepEqual(inorder(tree.root), [5]);
});

test('red-black-tree 空树合法', () => {
  const tree = new RedBlackTree();
  assert.equal(tree.root, null);
  assert.equal(isRedBlackTree(tree).ok, true);
  assert.deepEqual(inorder(tree.root), []);
});

test('red-black-tree 单节点为黑', () => {
  const tree = redBlackTree([42]);
  assert.equal(tree.root!.value, 42);
  assert.equal(tree.root!.color, 'BLACK');
});

test('red-black-tree 升序插入触发旋转与重着色', () => {
  let rotates = 0;
  let recolors = 0;
  redBlackTree([10, 20, 30], {
    onRotate: () => rotates++,
    onRecolor: () => recolors++,
  });
  // 插入 30 时：父 20 红、祖 10 黑、叔 null 黑 → Case 3 右旋 + 染色
  assert.ok(rotates >= 1, '应发生至少一次旋转');
  assert.ok(recolors >= 1, '应发生至少一次重着色');
});

test('red-black-tree Case 1（叔叔红）触发颜色翻转', () => {
  // 构造祖节点带两个红子（叔红）的场景：插入 2,1,3 后再插 0
  // 2,1,3 → 修复后根黑、左右红；插 0：父红、叔红 → Case 1
  let case1 = 0;
  redBlackTree([2, 1, 3, 0], {
    onFixCase: (c) => {
      if (c === 1) case1++;
    },
  });
  assert.ok(case1 >= 1, '应触发 Case 1（叔叔红）');
});

test('red-black-tree 钩子被调用', () => {
  let compares = 0;
  let inserts = 0;
  redBlackTree([10, 20, 5], {
    onCompare: () => compares++,
    onInsert: () => inserts++,
  });
  assert.ok(compares > 0, '应触发比较');
  assert.equal(inserts, 3);
});
