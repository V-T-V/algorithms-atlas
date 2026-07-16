import { test } from 'node:test';
import assert from 'node:assert/strict';
import { divisorGame, type DivisorGameHooks } from '../../src/algorithms/game/divisor-game/impl.ts';

test('divisor-game 偶数 Alice 必胜', () => {
  for (const n of [2, 4, 6, 8, 10, 100]) {
    assert.equal(divisorGame(n).aliceWins, true, `N=${n} 偶数应必胜`);
  }
});

test('divisor-game 奇数 Alice 必败', () => {
  for (const n of [1, 3, 5, 7, 9, 99]) {
    assert.equal(divisorGame(n).aliceWins, false, `N=${n} 奇数应必败`);
  }
});

test('divisor-game 经典例子 N=2 必胜，选 x=1', () => {
  const r = divisorGame(2);
  assert.equal(r.aliceWins, true);
  assert.equal(r.firstMove, 1); // 2-1=1，Bob 面对 1 必败
});

test('divisor-game dp[1]=false', () => {
  const r = divisorGame(5);
  assert.equal(r.dp[1], false);
});

test('divisor-game 必胜时 firstMove 合法（N 的真因数）', () => {
  for (const n of [2, 4, 6, 8, 12, 20]) {
    const r = divisorGame(n);
    if (r.aliceWins) {
      const x = r.firstMove;
      assert.ok(x >= 1 && x < n && n % x === 0, `N=${n} firstMove=${x} 应为真因数`);
      assert.equal(r.dp[n - x], false, `N=${n} 取 x=${x} 后应使对手必败`);
    }
  }
});

test('divisor-game N=1 必败', () => {
  const r = divisorGame(1);
  assert.equal(r.aliceWins, false);
  assert.equal(r.firstMove, 0);
});

test('divisor-game N<=0 安全', () => {
  assert.equal(divisorGame(0).aliceWins, false);
  assert.equal(divisorGame(-3).aliceWins, false);
});

test('divisor-game 钩子被调用', () => {
  let states = 0;
  let concludes = 0;
  const hooks: DivisorGameHooks = {
    onState: () => states++,
    onConclude: () => concludes++,
  };
  divisorGame(8, hooks);
  // 状态 2..8 共 7 次
  assert.equal(states, 7);
  assert.equal(concludes, 1);
});
