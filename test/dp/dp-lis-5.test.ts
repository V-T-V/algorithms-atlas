import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lengthOfLIS } from '../../src/algorithms/dp/dp-lis-5/impl.ts';

test('lis 经典', () => {
  assert.equal(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]), 4);
});
test('lis 全等', () => {
  assert.equal(lengthOfLIS([7, 7, 7, 7]), 1);
});
test('lis 空', () => {
  assert.equal(lengthOfLIS([]), 0);
});
test('lis 严格递增', () => {
  assert.equal(lengthOfLIS([1, 2, 3, 4]), 4);
});
