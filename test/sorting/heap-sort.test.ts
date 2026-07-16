import { test } from 'node:test';
import assert from 'node:assert/strict';
import { heapSort } from '../../src/algorithms/sorting/heap-sort/impl.ts';

test('heapSort 基本排序', () => {
  assert.deepEqual(heapSort([]), []);
  assert.deepEqual(heapSort([1]), [1]);
  assert.deepEqual(heapSort([2, 1]), [1, 2]);
  assert.deepEqual(heapSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('heapSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(heapSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(heapSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(heapSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('heapSort 不修改原数组', () => {
  const input = [3, 1, 2];
  heapSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('heapSort 钩子被调用', () => {
  let compares = 0;
  let swaps = 0;
  let pinned = 0;
  let buildPhase = 0;
  let sortPhase = 0;
  heapSort([3, 2, 1], {
    onBuildPhase: () => buildPhase++,
    onSortPhase: () => sortPhase++,
    onCompare: () => compares++,
    onSwap: () => swaps++,
    onPinned: () => pinned++,
  });
  assert.equal(buildPhase, 1, '应进入一次建堆阶段');
  assert.equal(sortPhase, 1, '应进入一次排序阶段');
  assert.ok(compares > 0, '应发生至少一次比较');
  assert.ok(swaps > 0, '应发生至少一次交换');
  assert.equal(pinned, 3, '应标记 3 个位置就位');
});
