import { test } from 'node:test';
import assert from 'node:assert/strict';
import { twoSum } from '../../src/algorithms/design/two-pointer-sum/impl.ts';

test('twoSum 基本命中', () => {
  const { pair } = twoSum([1, 2, 3, 4, 5, 6], 10);
  assert.deepEqual(pair, [3, 5]);
});

test('twoSum 首尾命中', () => {
  assert.deepEqual(twoSum([1, 2, 3, 9], 10).pair, [0, 3]);
});

test('twoSum 无解', () => {
  assert.equal(twoSum([1, 2, 3], 100).pair, null);
  assert.equal(twoSum([1, 3, 5], 2).pair, null);
});

test('twoSum 含负数（有序）', () => {
  // L=0,R=4: -5+7=2 → 首个命中对 [0,4]
  assert.deepEqual(twoSum([-5, -2, 0, 3, 7], 2).pair, [0, 4]);
  // L=0,R=4: -5+7=2>-2→R--; L=0,R=3: -5+3=-2 → [0,3]
  assert.deepEqual(twoSum([-5, -2, 0, 3, 7], -2).pair, [0, 3]);
});

test('twoSum 边界', () => {
  assert.equal(twoSum([1], 1).pair, null);
  assert.equal(twoSum([], 0).pair, null);
  assert.deepEqual(twoSum([1, 2], 3).pair, [0, 1]);
});

test('twoSum 不修改原数组', () => {
  const input = [1, 2, 3];
  twoSum(input, 5);
  assert.deepEqual(input, [1, 2, 3]);
});
