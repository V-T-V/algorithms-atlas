import { test } from 'node:test';
import assert from 'node:assert/strict';
import { houseRobber } from '../../src/algorithms/dp/dp-house-robber/impl.ts';

test('house-robber LeetCode 198 例', () => {
  assert.equal(houseRobber([1, 2, 3, 1]).total, 4);
  assert.equal(houseRobber([2, 7, 9, 3, 1]).total, 12);
});

test('house-robber 抢的下标合法（不相邻）', () => {
  const nums = [2, 7, 9, 3, 1];
  const { chosen, total } = houseRobber(nums);
  for (let i = 1; i < chosen.length; i++) {
    assert.ok(chosen[i]! - chosen[i - 1]! >= 2, '不应相邻');
  }
  let sum = 0;
  for (const i of chosen) sum += nums[i]!;
  assert.equal(sum, total);
});

test('house-robber 全零', () => {
  assert.equal(houseRobber([0, 0, 0]).total, 0);
});

test('house-robber 单屋', () => {
  assert.equal(houseRobber([5]).total, 5);
});

test('house-robber 空数组', () => {
  assert.equal(houseRobber([]).total, 0);
});

test('house-robber 钩子', () => {
  let steps = 0;
  houseRobber([1, 2, 3], { onStep: () => steps++ });
  assert.equal(steps, 3);
});
