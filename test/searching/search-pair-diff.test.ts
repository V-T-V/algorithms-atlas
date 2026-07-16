import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  pairWithDifference,
  type PairDiffHooks,
} from '../../src/algorithms/searching/search-pair-diff/impl.ts';

test('pairWithDifference 命中', () => {
  assert.deepEqual(pairWithDifference([1, 3, 5, 8, 12, 15], 7), [1, 4]);
  assert.deepEqual(pairWithDifference([1, 3, 5, 8, 12, 15], 2), [0, 1]);
  assert.deepEqual(pairWithDifference([1, 3, 5, 8, 12, 15], 0), [-1, -1]);
});
test('pairWithDifference 未命中', () => {
  assert.deepEqual(pairWithDifference([1, 3, 5, 8, 12, 15], 100), [-1, -1]);
  assert.deepEqual(pairWithDifference([], 1), [-1, -1]);
});
test('pairWithDifference 钩子', () => {
  let c = 0;
  pairWithDifference([1, 3, 5, 8, 12, 15], 7, { onCompare: () => c++ } as PairDiffHooks);
  assert.ok(c >= 1);
});
