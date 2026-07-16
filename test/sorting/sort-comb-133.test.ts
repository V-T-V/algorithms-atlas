import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combSort133, type Comb133Hooks } from '../../src/algorithms/sorting/sort-comb-133/impl.ts';

test('sort-comb-133 基本排序', () => {
  assert.deepEqual(combSort133([]), []);
  assert.deepEqual(combSort133([1]), [1]);
  assert.deepEqual(combSort133([2, 1]), [1, 2]);
  assert.deepEqual(combSort133([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('sort-comb-133 逆序/重复', () => {
  assert.deepEqual(combSort133([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(combSort133([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('sort-comb-133 不修改原数组', () => {
  const input = [3, 1, 2];
  combSort133(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sort-comb-133 钩子', () => {
  let c = 0;
  combSort133([3, 1, 2], { onCompare: () => c++ } as Comb133Hooks);
  assert.ok(c >= 1);
});
