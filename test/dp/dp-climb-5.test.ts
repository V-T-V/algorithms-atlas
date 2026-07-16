import { test } from 'node:test';
import assert from 'node:assert/strict';
import { climbStairsK } from '../../src/algorithms/dp/dp-climb-5/impl.ts';

test('climb k=2 经典', () => {
  assert.equal(climbStairsK(4, 2), 5);
});
test('climb k=3', () => {
  assert.equal(climbStairsK(3, 3), 4); // 1+1+1, 1+2, 2+1, 3
});
test('climb n=0', () => {
  assert.equal(climbStairsK(0, 3), 1);
});
