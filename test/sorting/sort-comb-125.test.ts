import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combSort125, type Comb125Hooks } from '../../src/algorithms/sorting/sort-comb-125/impl.ts';

test('sort-comb-125 基本排序', () => {
  assert.deepEqual(combSort125([]), []);
  assert.deepEqual(combSort125([1]), [1]);
  assert.deepEqual(combSort125([2, 1]), [1, 2]);
  assert.deepEqual(combSort125([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('sort-comb-125 逆序/重复', () => {
  assert.deepEqual(combSort125([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(combSort125([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('sort-comb-125 不修改原数组', () => {
  const input = [3, 1, 2];
  combSort125(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sort-comb-125 钩子', () => {
  let c = 0;
  combSort125([3, 1, 2], { onCompare: () => c++ } as Comb125Hooks);
  assert.ok(c >= 1);
});
