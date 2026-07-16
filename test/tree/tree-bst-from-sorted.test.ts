import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sortedArrayToBST,
  height,
  inorder,
} from '../../src/algorithms/tree/tree-bst-from-sorted/impl.ts';

test('构造后中序等于原数组', () => {
  const arr = [1, 2, 3, 4, 5, 6, 7];
  const root = sortedArrayToBST(arr);
  assert.deepEqual(inorder(root), arr);
});

test('高度平衡', () => {
  const arr = [1, 2, 3, 4, 5, 6, 7];
  const root = sortedArrayToBST(arr);
  // n=7 平衡高度应为 3
  assert.equal(height(root), 3);
});

test('根为中点', () => {
  const arr = [1, 2, 3, 4, 5];
  const root = sortedArrayToBST(arr);
  assert.equal(root!.value, 3);
});

test('单元素', () => {
  const root = sortedArrayToBST([42]);
  assert.equal(root!.value, 42);
});

test('空数组', () => {
  assert.equal(sortedArrayToBST([]), null);
});

test('偶数长度', () => {
  const arr = [1, 2, 3, 4];
  const root = sortedArrayToBST(arr);
  assert.deepEqual(inorder(root), arr);
  assert.equal(height(root), 3);
});

test('无序数组抛错', () => {
  assert.throws(() => sortedArrayToBST([3, 1, 2]), RangeError);
});

test('大数组高度仍 O(log n)', () => {
  const arr = Array.from({ length: 1023 }, (_, i) => i);
  const root = sortedArrayToBST(arr);
  // 1023 = 2^10 - 1，平衡高度应为 10
  assert.equal(height(root), 10);
});

test('回调触发', () => {
  let picks = 0;
  sortedArrayToBST([1, 2, 3], { onPick: () => picks++ });
  assert.equal(picks, 3);
});
