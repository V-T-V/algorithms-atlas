import { test } from 'node:test';
import assert from 'node:assert/strict';
import { twoSumExists } from '../../src/algorithms/randomized/rand-2sum-check/impl.ts';
test('存在', () => {
  assert.equal(twoSumExists([1, 2, 3, 4], 7, 42), true);
});
test('不存在', () => {
  assert.equal(twoSumExists([1, 2, 3], 100, 42), false);
});
