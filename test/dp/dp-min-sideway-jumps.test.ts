import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minSideJumps } from '../../src/algorithms/dp/dp-min-sideway-jumps/impl.ts';

test('min-sideway-jumps LeetCode 1824 例 1', () => {
  assert.equal(minSideJumps([0, 1, 2, 3, 0]), 2);
});

test('min-sideway-jumps LeetCode 1824 例 2', () => {
  assert.equal(minSideJumps([0, 1, 1, 3, 3, 0]), 0);
});

test('min-sideway-jumps 无障碍', () => {
  assert.equal(minSideJumps([0, 0, 0, 0]), 0);
});

test('min-sideway-jumps 起点畅通', () => {
  assert.equal(minSideJumps([0, 0, 0, 0, 0]), 0);
});

test('min-sideway-jumps 单位置', () => {
  assert.equal(minSideJumps([0]), 0);
});
