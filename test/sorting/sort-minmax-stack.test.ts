import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  minmaxStackSort,
  type MinMaxStackHooks,
} from '../../src/algorithms/sorting/sort-minmax-stack/impl.ts';

test('minmaxStackSort 基本', () => {
  assert.deepEqual(minmaxStackSort([]), []);
  assert.deepEqual(minmaxStackSort([1]), [1]);
  assert.deepEqual(minmaxStackSort([2, 1]), [1, 2]);
  assert.deepEqual(minmaxStackSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('minmaxStackSort 逆序/重复', () => {
  assert.deepEqual(minmaxStackSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(minmaxStackSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('minmaxStackSort 钩子', () => {
  let c = 0;
  minmaxStackSort([3, 1, 2], { onSelect: () => c++ } as MinMaxStackHooks);
  assert.ok(c >= 1);
});
