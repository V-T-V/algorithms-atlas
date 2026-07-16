import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  medianOfTwoSorted,
  type MedianTwoHooks,
} from '../../src/algorithms/searching/search-median-two/impl.ts';

test('medianOfTwoSorted 基本', () => {
  assert.equal(medianOfTwoSorted([1, 3], [2]), 2);
  assert.equal(medianOfTwoSorted([1, 2], [3, 4]), 2.5);
  assert.equal(medianOfTwoSorted([0, 0], [0, 0]), 0);
  assert.equal(medianOfTwoSorted([], [1]), 1);
  assert.equal(medianOfTwoSorted([2], []), 2);
});
test('medianOfTwoSorted 钩子', () => {
  let c = 0;
  medianOfTwoSorted([1, 3], [2], { onPartition: () => c++ } as MedianTwoHooks);
  assert.ok(c >= 1);
});
