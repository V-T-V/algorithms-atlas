import { test } from 'node:test';
import assert from 'node:assert/strict';
import { invertTree, buildTree, levelOrder } from '../../src/algorithms/tree/tree-invert/impl.ts';

test('invertTree 基本翻转', () => {
  const root = buildTree([4, 2, 7, 1, 3, 6, 9]);
  const inv = invertTree(root);
  assert.deepEqual(levelOrder(inv), [4, 7, 2, 9, 6, 3, 1]);
});

test('invertTree 不修改原树', () => {
  const root = buildTree([4, 2, 7]);
  const before = levelOrder(root);
  invertTree(root);
  assert.deepEqual(levelOrder(root), before);
});

test('invertTree 两次翻转回到原树', () => {
  const root = buildTree([4, 2, 7, 1, 3, 6, 9]);
  const twice = invertTree(invertTree(root));
  assert.deepEqual(levelOrder(twice), [4, 2, 7, 1, 3, 6, 9]);
});

test('invertTree 边界', () => {
  assert.equal(invertTree(null), null);
  assert.deepEqual(levelOrder(invertTree(buildTree([1]))), [1]);
});

test('invertTree 钩子：每个节点被交换一次', () => {
  const swaps: number[] = [];
  invertTree(buildTree([4, 2, 7, 1, 3]), { onSwap: (v) => swaps.push(v) });
  assert.equal(swaps.length, 5);
});
