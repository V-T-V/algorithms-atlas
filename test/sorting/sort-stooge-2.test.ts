import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stoogeSort2, type Stooge2Hooks } from '../../src/algorithms/sorting/sort-stooge-2/impl.ts';

test('sort-stooge-2 基本排序', () => {
  assert.deepEqual(stoogeSort2([]), []);
  assert.deepEqual(stoogeSort2([1]), [1]);
  assert.deepEqual(stoogeSort2([2, 1]), [1, 2]);
  assert.deepEqual(stoogeSort2([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('sort-stooge-2 逆序/重复', () => {
  assert.deepEqual(stoogeSort2([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(stoogeSort2([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('sort-stooge-2 不修改原数组', () => {
  const input = [3, 1, 2];
  stoogeSort2(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sort-stooge-2 钩子', () => {
  let c = 0;
  stoogeSort2([3, 1, 2], { onCompare: () => c++ } as Stooge2Hooks);
  assert.ok(c >= 1);
});
