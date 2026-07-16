import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stoneGame, type StoneGameGHooks } from '../../src/algorithms/game/stone-game-g/impl.ts';

test('stone-game-g 偶数堆 Alex 总是赢', () => {
  // LeetCode 877 结论：偶数堆时 Alex 总能赢
  assert.equal(stoneGame([5, 3, 4, 5]).alexWins, true);
  assert.equal(stoneGame([3, 7, 2, 3]).alexWins, true);
});

test('stone-game-g [5,3,4,5] 分差', () => {
  // 经典例子
  const r = stoneGame([5, 3, 4, 5]);
  assert.equal(r.alexWins, true);
  assert.ok(r.gap > 0);
});

test('stone-game-g dp 对角线为 piles[i]', () => {
  const piles = [5, 3, 4, 5];
  const r = stoneGame(piles);
  for (let i = 0; i < piles.length; i++) {
    assert.equal(r.dp[i]![i], piles[i]);
  }
});

test('stone-game-g dp[0][n-1] = gap', () => {
  const piles = [3, 7, 2, 3];
  const r = stoneGame(piles);
  assert.equal(r.dp[0]![piles.length - 1], r.gap);
});

test('stone-game-g 空数组', () => {
  const r = stoneGame([]);
  assert.equal(r.alexWins, false);
  assert.equal(r.gap, 0);
});

test('stone-game-g 单堆', () => {
  const r = stoneGame([7]);
  assert.equal(r.alexWins, true);
  assert.equal(r.gap, 7);
});

test('stone-game-g 与暴力 minimax 一致', () => {
  // 暴力：当前玩家面对 [i..j] 的最优分差
  const piles = [4, 2, 7, 1, 6, 3];
  const brute = (i: number, j: number): number => {
    if (i === j) return piles[i]!;
    return Math.max(piles[i]! - brute(i + 1, j), piles[j]! - brute(i, j - 1));
  };
  const r = stoneGame(piles);
  assert.equal(r.gap, brute(0, piles.length - 1));
});

test('stone-game-g 钩子被调用', () => {
  let intervals = 0;
  let concludes = 0;
  const hooks: StoneGameGHooks = {
    onInterval: () => intervals++,
    onConclude: () => concludes++,
  };
  stoneGame([5, 3, 4, 5], hooks);
  // 区间数 = n*(n-1)/2 = 4*3/2 = 6（长度 >=2）
  assert.equal(intervals, 6);
  assert.equal(concludes, 1);
});
