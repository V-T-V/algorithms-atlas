import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stoneGame4 } from '../../src/algorithms/dp/dp-stone-game-iv/impl.ts';

test('stone-game-iv n=1 必胜（取 1）', () => {
  assert.equal(stoneGame4(1).firstWins, true);
});

test('stone-game-iv n=2 必败（只能取 1，剩 1 给对手）', () => {
  assert.equal(stoneGame4(2).firstWins, false);
});

test('stone-game-iv n=4 必胜（取 4）', () => {
  assert.equal(stoneGame4(4).firstWins, true);
});

test('stone-game-iv n=8 必胜', () => {
  // 取 1 -> 剩 7（必败态给对手）则必胜；7 = ? dp[7]=false 吗
  // dp[7]: 取1->dp[6], 取4->dp[3]. dp[6]取1->dp[5],取4->dp[2=L]->dp[6]=W
  // dp[3]取1->dp[2=L]->dp[3]=W. 所以 dp[7]取1->dp[6]=W(对手胜),取4->dp[3]=W(对手胜) -> dp[7]=L
  // 故 dp[8] 取1 -> 剩 dp[7]=L(对手败) -> dp[8]=W
  assert.equal(stoneGame4(8).firstWins, true);
});

test('stone-game-iv n=7 必败', () => {
  assert.equal(stoneGame4(7).firstWins, false);
});

test('stone-game-iv n=0', () => {
  assert.equal(stoneGame4(0).firstWins, false);
});

test('stone-game-iv 钩子被调用', () => {
  let calls = 0;
  stoneGame4(10, { onState: () => calls++ });
  assert.equal(calls, 11);
});
