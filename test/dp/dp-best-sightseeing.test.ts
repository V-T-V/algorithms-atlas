import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxScoreSightseeingPair } from '../../src/algorithms/dp/dp-best-sightseeing/impl.ts';

test('best-sightseeing LeetCode 1014 例 1', () => {
  assert.equal(maxScoreSightseeingPair([8, 1, 5, 2, 6]), 11);
});

test('best-sightseeing LeetCode 1014 例 2', () => {
  assert.equal(maxScoreSightseeingPair([1, 2]), 2);
});

test('best-sightseeing 三个元素', () => {
  assert.equal(maxScoreSightseeingPair([1, 3, 5]), 7);
});

test('best-sightseeing 单元素', () => {
  assert.equal(maxScoreSightseeingPair([5]), 0);
});

test('best-sightseeing 空', () => {
  assert.equal(maxScoreSightseeingPair([]), 0);
});
