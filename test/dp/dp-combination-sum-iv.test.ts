import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combinationSum4 } from '../../src/algorithms/dp/dp-combination-sum-iv/impl.ts';

test('combination-sum-iv LeetCode 377 例 1', () => {
  assert.equal(combinationSum4([1, 2, 3], 4), 7);
});

test('combination-sum-iv LeetCode 377 例 2', () => {
  assert.equal(combinationSum4([9], 3), 0);
});

test('combination-sum-iv target=1', () => {
  assert.equal(combinationSum4([1, 2], 1), 1);
});

test('combination-sum-iv 含自身', () => {
  assert.equal(combinationSum4([3], 3), 1);
});

test('combination-sum-iv 较大值', () => {
  // nums=[1,2], target=3: 111, 12, 21 → 3
  assert.equal(combinationSum4([1, 2], 3), 3);
});
