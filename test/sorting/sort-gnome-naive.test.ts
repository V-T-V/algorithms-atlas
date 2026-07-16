import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  gnomeSortNaive,
  type GnomeNaiveHooks,
} from '../../src/algorithms/sorting/sort-gnome-naive/impl.ts';

test('sort-gnome-naive 基本排序', () => {
  assert.deepEqual(gnomeSortNaive([]), []);
  assert.deepEqual(gnomeSortNaive([1]), [1]);
  assert.deepEqual(gnomeSortNaive([2, 1]), [1, 2]);
  assert.deepEqual(gnomeSortNaive([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('sort-gnome-naive 逆序/重复', () => {
  assert.deepEqual(gnomeSortNaive([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(gnomeSortNaive([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('sort-gnome-naive 不修改原数组', () => {
  const input = [3, 1, 2];
  gnomeSortNaive(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sort-gnome-naive 钩子', () => {
  let c = 0;
  gnomeSortNaive([3, 1, 2], { onCompare: () => c++ } as GnomeNaiveHooks);
  assert.ok(c >= 1);
});
