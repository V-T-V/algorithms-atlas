import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectionSort } from '../../src/algorithms/sorting/selection-sort/impl.ts';

test('selectionSort 基本排序', () => {
  assert.deepEqual(selectionSort([]), []);
  assert.deepEqual(selectionSort([1]), [1]);
  assert.deepEqual(selectionSort([2, 1]), [1, 2]);
  assert.deepEqual(selectionSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('selectionSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(selectionSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(selectionSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(selectionSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('selectionSort 不修改原数组', () => {
  const input = [3, 1, 2];
  selectionSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('selectionSort 钩子被调用', () => {
  let compares = 0;
  let swaps = 0;
  let pinned = 0;
  selectionSort([3, 2, 1], {
    onCompare: () => compares++,
    onSwap: () => swaps++,
    onPinned: () => pinned++,
  });
  assert.equal(compares, 3, '比较次数 = (n-1)+(n-2) = 3');
  assert.ok(swaps > 0, '应发生至少一次交换');
  assert.equal(pinned, 3, '应标记 3 个位置就位');
});

test('selectionSort 比较次数与输入无关', () => {
  let c1 = 0;
  let c2 = 0;
  selectionSort([1, 2, 3, 4, 5], { onCompare: () => c1++ });
  selectionSort([5, 4, 3, 2, 1], { onCompare: () => c2++ });
  assert.equal(c1, c2, '已序与逆序的比较次数应相同');
  assert.equal(c1, 4 + 3 + 2 + 1);
});
