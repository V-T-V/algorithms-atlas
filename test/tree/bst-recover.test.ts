import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bstRecover,
  buildTree,
  swapValues,
  type RecoverHooks,
} from '../../src/algorithms/tree/bst-recover/impl.ts';

test('bst-recover 空树与单节点：无操作', () => {
  assert.deepEqual(bstRecover(null), { swapped: [NaN, NaN], inorder: [] });
  const single = buildTree([5]);
  assert.deepEqual(bstRecover(single), { swapped: [NaN, NaN], inorder: [5] });
});

test('bst-recover 非相邻交换：交换 2 和 6（中序 1,2,3,4,5,6,7）', () => {
  // 合法 BST：中序 [1,2,3,4,5,6,7]
  //          4
  //        /   \
  //       2     6
  //      / \   / \
  //     1   3 5   7
  const root = buildTree([4, 2, 6, 1, 3, 5, 7]);
  swapValues(root, 2, 6); // 现在节点 2 位置上值=6，节点 6 位置上值=2
  const result = bstRecover(root);
  // 被交换的两个值（在损坏树中是 6 与 2）
  assert.deepEqual(
    [...result.swapped].sort((a, b) => a - b),
    [2, 6],
  );
  // 恢复后中序严格递增
  assert.deepEqual(result.inorder, [1, 2, 3, 4, 5, 6, 7]);
});

test('bst-recover 相邻交换：交换 3 和 4（只产生 1 个逆序对）', () => {
  const root = buildTree([4, 2, 6, 1, 3, 5, 7]);
  swapValues(root, 3, 4); // 根变成 3，原 3 位置变成 4
  const result = bstRecover(root);
  assert.deepEqual(
    [...result.swapped].sort((a, b) => a - b),
    [3, 4],
  );
  assert.deepEqual(result.inorder, [1, 2, 3, 4, 5, 6, 7]);
});

test('bst-recover 交换根与叶子：交换 1 和 4', () => {
  const root = buildTree([4, 2, 6, 1, 3, 5, 7]);
  swapValues(root, 1, 4);
  const result = bstRecover(root);
  assert.deepEqual(
    [...result.swapped].sort((a, b) => a - b),
    [1, 4],
  );
  assert.deepEqual(result.inorder, [1, 2, 3, 4, 5, 6, 7]);
});

test('bst-recover hooks 被正确触发', () => {
  const root = buildTree([4, 2, 6, 1, 3, 5, 7]);
  swapValues(root, 2, 6);
  const visits: number[] = [];
  const anomalies: Array<[number, number]> = [];
  let swappedPair: [number, number] | null = null;
  const hooks: RecoverHooks = {
    onVisit: (v) => visits.push(v),
    onAnomaly: (prev, curr) => anomalies.push([prev, curr]),
    onSwap: (a, b) => {
      swappedPair = [a, b];
    },
  };
  const result = bstRecover(root, hooks);
  // 7 个节点都被访问
  assert.equal(visits.length, 7);
  // 应当出现 2 个逆序对（非相邻交换）
  assert.equal(anomalies.length, 2);
  // onSwap 给出被交换的两值
  assert.ok(swappedPair !== null);
  assert.deepEqual(
    [...swappedPair!].sort((a, b) => a - b),
    [2, 6],
  );
  // 结果一致
  assert.deepEqual(result.inorder, [1, 2, 3, 4, 5, 6, 7]);
});
