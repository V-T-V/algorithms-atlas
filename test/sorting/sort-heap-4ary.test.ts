import { test } from 'node:test';
import assert from 'node:assert/strict';
import { heapSort4ary, type Heap4Hooks } from '../../src/algorithms/sorting/sort-heap-4ary/impl.ts';

test('heapSort4ary 基本', () => {
  assert.deepEqual(heapSort4ary([]), []);
  assert.deepEqual(heapSort4ary([1]), [1]);
  assert.deepEqual(heapSort4ary([2, 1]), [1, 2]);
  assert.deepEqual(heapSort4ary([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('heapSort4ary 逆序/重复', () => {
  assert.deepEqual(heapSort4ary([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(heapSort4ary([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('heapSort4ary 不修改原数组', () => {
  const input = [3, 1, 2];
  heapSort4ary(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('heapSort4ary 钩子', () => {
  let c = 0;
  heapSort4ary([3, 1, 2], { onSiftDown: () => c++ } as Heap4Hooks);
  assert.ok(c >= 1);
});
