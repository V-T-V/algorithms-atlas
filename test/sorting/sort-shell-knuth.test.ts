import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  shellSortKnuth,
  type ShellKnuthHooks,
} from '../../src/algorithms/sorting/sort-shell-knuth/impl.ts';

test('sort-shell-knuth 基本排序', () => {
  assert.deepEqual(shellSortKnuth([]), []);
  assert.deepEqual(shellSortKnuth([1]), [1]);
  assert.deepEqual(shellSortKnuth([2, 1]), [1, 2]);
  assert.deepEqual(shellSortKnuth([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('sort-shell-knuth 逆序/重复', () => {
  assert.deepEqual(shellSortKnuth([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(shellSortKnuth([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('sort-shell-knuth 不修改原数组', () => {
  const input = [3, 1, 2];
  shellSortKnuth(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sort-shell-knuth 钩子', () => {
  let c = 0;
  shellSortKnuth([3, 1, 2], { onCompare: () => c++ } as ShellKnuthHooks);
  assert.ok(c >= 1);
});
