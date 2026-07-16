import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lastStoneWeightII } from '../../src/algorithms/dp/dp-last-stone-weight/impl.ts';

test('last-stone LeetCode 1049 例 1', () => {
  assert.equal(lastStoneWeightII([2, 7, 4, 1, 8, 1]), 1);
});

test('last-stone LeetCode 1049 例 2', () => {
  assert.equal(lastStoneWeightII([31, 26, 33, 21, 40]), 5);
});

test('last-stone 两块相等', () => {
  assert.equal(lastStoneWeightII([5, 5]), 0);
});

test('last-stone 单块', () => {
  assert.equal(lastStoneWeightII([7]), 7);
});

test('last-stone 空', () => {
  assert.equal(lastStoneWeightII([]), 0);
});
