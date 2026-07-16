import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  predictTheWinner,
  type PredictTheWinnerHooks,
} from '../../src/algorithms/game/predict-the-winner/impl.ts';

test('predict-the-winner [1,5,2] → false', () => {
  // LeetCode 示例 1：玩家 1 输
  assert.equal(predictTheWinner([1, 5, 2]).player1Wins, false);
});

test('predict-the-winner [1,5,233,7] → true', () => {
  // LeetCode 示例 2：玩家 1 赢
  assert.equal(predictTheWinner([1, 5, 233, 7]).player1Wins, true);
});

test('predict-the-winner 单元素玩家 1 赢', () => {
  assert.equal(predictTheWinner([5]).player1Wins, true);
  assert.equal(predictTheWinner([0]).player1Wins, true);
});

test('predict-the-winner 空数组玩家 1 不输', () => {
  assert.equal(predictTheWinner([]).player1Wins, true);
});

test('predict-the-winner 两元素取较大', () => {
  assert.equal(predictTheWinner([1, 5]).player1Wins, true); // 取 5
  assert.equal(predictTheWinner([5, 1]).player1Wins, true);
});

test('predict-the-winner [1,5,2,4]', () => {
  // 玩家1 取 4，剩 [1,5,2]；玩家2 取 2，剩 [1,5]；玩家1 取 5，剩 [1]；玩家2 取 1
  // 玩家1=4+5=9, 玩家2=2+1=3 → 赢
  const r = predictTheWinner([1, 5, 2, 4]);
  assert.equal(r.player1Wins, true);
});

test('predict-the-winner dp 对角线 = nums[i]', () => {
  const nums = [1, 5, 2];
  const r = predictTheWinner(nums);
  for (let i = 0; i < nums.length; i++) {
    assert.equal(r.dp[i]![i], nums[i]);
  }
});

test('predict-the-winner gap = dp[0][n-1]', () => {
  const r = predictTheWinner([1, 5, 233, 7]);
  assert.equal(r.gap, r.dp[0]![3]);
});

test('predict-the-winner 与暴力 minimax 一致', () => {
  const brute = (nums: number[], i: number, j: number): number => {
    if (i === j) return nums[i]!;
    return Math.max(nums[i]! - brute(nums, i + 1, j), nums[j]! - brute(nums, i, j - 1));
  };
  const cases = [
    [1, 5, 2],
    [1, 5, 233, 7],
    [3, 7, 2, 9],
    [1, 2, 3, 4, 5],
  ];
  for (const c of cases) {
    assert.equal(predictTheWinner(c).gap, brute(c, 0, c.length - 1));
  }
});

test('predict-the-winner 钩子被调用', () => {
  let intervals = 0;
  let concludes = 0;
  const hooks: PredictTheWinnerHooks = {
    onInterval: () => intervals++,
    onConclude: () => concludes++,
  };
  predictTheWinner([1, 5, 2], hooks);
  assert.ok(intervals > 0);
  assert.equal(concludes, 1);
});
