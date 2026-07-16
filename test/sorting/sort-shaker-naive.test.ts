import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  shakerSortNaive,
  type ShakerNaiveHooks,
} from '../../src/algorithms/sorting/sort-shaker-naive/impl.ts';

test('sort-shaker-naive 基本排序', () => {
  assert.deepEqual(shakerSortNaive([]), []);
  assert.deepEqual(shakerSortNaive([1]), [1]);
  assert.deepEqual(shakerSortNaive([2, 1]), [1, 2]);
  assert.deepEqual(shakerSortNaive([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('sort-shaker-naive 逆序/重复', () => {
  assert.deepEqual(shakerSortNaive([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(shakerSortNaive([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('sort-shaker-naive 不修改原数组', () => {
  const input = [3, 1, 2];
  shakerSortNaive(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sort-shaker-naive 钩子', () => {
  let c = 0;
  shakerSortNaive([3, 1, 2], { onCompare: () => c++ } as ShakerNaiveHooks);
  assert.ok(c >= 1);
});
