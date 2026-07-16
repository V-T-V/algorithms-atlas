import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  cocktailSortBound,
  type CocktailBoundHooks,
} from '../../src/algorithms/sorting/sort-cocktail-bound/impl.ts';

test('sort-cocktail-bound 基本排序', () => {
  assert.deepEqual(cocktailSortBound([]), []);
  assert.deepEqual(cocktailSortBound([1]), [1]);
  assert.deepEqual(cocktailSortBound([2, 1]), [1, 2]);
  assert.deepEqual(cocktailSortBound([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('sort-cocktail-bound 逆序/重复', () => {
  assert.deepEqual(cocktailSortBound([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(cocktailSortBound([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('sort-cocktail-bound 不修改原数组', () => {
  const input = [3, 1, 2];
  cocktailSortBound(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sort-cocktail-bound 钩子', () => {
  let c = 0;
  cocktailSortBound([3, 1, 2], { onCompare: () => c++ } as CocktailBoundHooks);
  assert.ok(c >= 1);
});
