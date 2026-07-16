import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  pancakeSortMin,
  type PancakeMinHooks,
} from '../../src/algorithms/sorting/sort-pancake-min/impl.ts';

test('pancakeSortMin 基本', () => {
  assert.deepEqual(pancakeSortMin([]), []);
  assert.deepEqual(pancakeSortMin([1]), [1]);
  assert.deepEqual(pancakeSortMin([2, 1]), [1, 2]);
  assert.deepEqual(pancakeSortMin([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('pancakeSortMin 逆序/重复', () => {
  assert.deepEqual(pancakeSortMin([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(pancakeSortMin([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('pancakeSortMin 不修改原数组', () => {
  const input = [3, 1, 2];
  pancakeSortMin(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('pancakeSortMin 钩子', () => {
  let c = 0;
  pancakeSortMin([3, 1, 2], { onFlip: () => c++ } as PancakeMinHooks);
  assert.ok(c >= 1);
});
