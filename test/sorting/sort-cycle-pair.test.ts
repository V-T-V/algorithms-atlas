import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  cycleSortPair,
  type CyclePairHooks,
} from '../../src/algorithms/sorting/sort-cycle-pair/impl.ts';

test('cycleSortPair 基本', () => {
  assert.deepEqual(cycleSortPair([]), []);
  assert.deepEqual(cycleSortPair([1]), [1]);
  assert.deepEqual(cycleSortPair([2, 1]), [1, 2]);
  assert.deepEqual(cycleSortPair([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('cycleSortPair 逆序/重复', () => {
  assert.deepEqual(cycleSortPair([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(cycleSortPair([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('cycleSortPair 不修改原数组', () => {
  const input = [3, 1, 2];
  cycleSortPair(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('cycleSortPair 钩子', () => {
  let c = 0;
  cycleSortPair([3, 1, 2], { onCycle: () => c++ } as CyclePairHooks);
  assert.ok(c >= 1);
});
