import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combSort3, type Comb3Hooks } from '../../src/algorithms/sorting/sort-comb-3/impl.ts';

test('sort-comb-3 基本排序', () => {
  assert.deepEqual(combSort3([]), []);
  assert.deepEqual(combSort3([1]), [1]);
  assert.deepEqual(combSort3([2, 1]), [1, 2]);
  assert.deepEqual(combSort3([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('sort-comb-3 逆序/重复', () => {
  assert.deepEqual(combSort3([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(combSort3([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('sort-comb-3 不修改原数组', () => {
  const input = [3, 1, 2];
  combSort3(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sort-comb-3 钩子', () => {
  let c = 0;
  combSort3([3, 1, 2], { onCompare: () => c++ } as Comb3Hooks);
  assert.ok(c >= 1);
});
