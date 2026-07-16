import { test } from 'node:test';
import assert from 'node:assert/strict';
import { climbStairsVar } from '../../src/algorithms/dp/dp-climb-stairs-3/impl.ts';

test('climb-stairs-var steps[1,2] n=5 经典', () => {
  // Fibonacci-like: 1,2,3,5,8
  assert.equal(climbStairsVar(5, [1, 2]), 8);
});

test('climb-stairs-var steps[1,2,3] n=4', () => {
  // dp:1,1,2,4,7
  assert.equal(climbStairsVar(4, [1, 2, 3]), 7);
});

test('climb-stairs-var n=0', () => {
  assert.equal(climbStairsVar(0, [1, 2]), 1);
});

test('climb-stairs-var steps[2] n=3 偶数阶', () => {
  // 只能走 2 阶，n=3 无法到达 => 0
  assert.equal(climbStairsVar(3, [2]), 0);
});

test('climb-stairs-var steps[2] n=4', () => {
  assert.equal(climbStairsVar(4, [2]), 1);
});
