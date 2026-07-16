import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  shellSortCiura,
  type ShellCiuraHooks,
} from '../../src/algorithms/sorting/sort-shell-ciura/impl.ts';

test('sort-shell-ciura 基本排序', () => {
  assert.deepEqual(shellSortCiura([]), []);
  assert.deepEqual(shellSortCiura([1]), [1]);
  assert.deepEqual(shellSortCiura([2, 1]), [1, 2]);
  assert.deepEqual(shellSortCiura([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('sort-shell-ciura 逆序/重复', () => {
  assert.deepEqual(shellSortCiura([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(shellSortCiura([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('sort-shell-ciura 不修改原数组', () => {
  const input = [3, 1, 2];
  shellSortCiura(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sort-shell-ciura 钩子', () => {
  let c = 0;
  shellSortCiura([3, 1, 2], { onCompare: () => c++ } as ShellCiuraHooks);
  assert.ok(c >= 1);
});
