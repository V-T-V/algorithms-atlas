import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minDiffSubset } from '../../src/algorithms/dp/dp-min-diff-subset/impl.ts';

test('min-diff-subset [1,6,11,5] = 1', () => {
  // {1,6,5}=12 vs {11}=11 → 差 1
  assert.equal(minDiffSubset([1, 6, 11, 5]), 1);
});

test('min-diff-subset [1,2,3,4] = 0', () => {
  // {1,4}=5 vs {2,3}=5
  assert.equal(minDiffSubset([1, 2, 3, 4]), 0);
});

test('min-diff-subset [3,9,7,3] = 2', () => {
  assert.equal(minDiffSubset([3, 9, 7, 3]), 2);
});

test('min-diff-subset 单元素', () => {
  assert.equal(minDiffSubset([5]), 5);
});

test('min-diff-subset 空', () => {
  assert.equal(minDiffSubset([]), 0);
});
