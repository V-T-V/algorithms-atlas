import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  pigeonholeSortMap,
  type PigeonholeMapHooks,
} from '../../src/algorithms/sorting/sort-pigeonhole-map/impl.ts';

test('pigeonholeSortMap 基本', () => {
  assert.deepEqual(pigeonholeSortMap([]), []);
  assert.deepEqual(pigeonholeSortMap([1]), [1]);
  assert.deepEqual(pigeonholeSortMap([2, 1]), [1, 2]);
  assert.deepEqual(pigeonholeSortMap([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('pigeonholeSortMap 重复', () => {
  assert.deepEqual(pigeonholeSortMap([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('pigeonholeSortMap 钩子', () => {
  let c = 0;
  pigeonholeSortMap([3, 1, 2], { onPlace: () => c++ } as PigeonholeMapHooks);
  assert.ok(c >= 1);
});
