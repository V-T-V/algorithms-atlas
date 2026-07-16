import { test } from 'node:test';
import assert from 'node:assert/strict';
import { climbStairsObstacle } from '../../src/algorithms/dp/dp-climb-stairs-4/impl.ts';

test('climb-stairs 无障碍', () => {
  assert.equal(climbStairsObstacle([false, false, false, false]), 5);
});

test('climb-stairs 第3阶障碍', () => {
  assert.equal(climbStairsObstacle([false, false, true, false, false]), 2);
});

test('climb-stairs 终点障碍', () => {
  assert.equal(climbStairsObstacle([false, false, true]), 0);
});

test('climb-stairs 空', () => {
  assert.equal(climbStairsObstacle([]), 1);
});
