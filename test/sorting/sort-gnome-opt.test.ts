import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  gnomeSortOpt,
  type GnomeOptHooks,
} from '../../src/algorithms/sorting/sort-gnome-opt/impl.ts';

test('sort-gnome-opt 基本排序', () => {
  assert.deepEqual(gnomeSortOpt([]), []);
  assert.deepEqual(gnomeSortOpt([1]), [1]);
  assert.deepEqual(gnomeSortOpt([2, 1]), [1, 2]);
  assert.deepEqual(gnomeSortOpt([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('sort-gnome-opt 逆序/重复', () => {
  assert.deepEqual(gnomeSortOpt([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(gnomeSortOpt([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('sort-gnome-opt 不修改原数组', () => {
  const input = [3, 1, 2];
  gnomeSortOpt(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sort-gnome-opt 钩子', () => {
  let c = 0;
  gnomeSortOpt([3, 1, 2], { onCompare: () => c++ } as GnomeOptHooks);
  assert.ok(c >= 1);
});
