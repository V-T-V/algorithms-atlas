import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  coinChangeGame,
  type CoinChangeGameHooks,
} from '../../src/algorithms/game/coin-change-game/impl.ts';

test('coin-change-game SG 值周期为 m+1，0..m', () => {
  // n=10,m=4 → SG 应为 0,1,2,3,4,0,1,2,3,4,0
  const r = coinChangeGame(10, 4);
  assert.deepEqual(r.sg, [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0]);
});

test('coin-change-game n 是 (m+1) 倍数时先手必败', () => {
  // n=10,m=4 → 10%5=0 → 必败
  const r = coinChangeGame(10, 4);
  assert.equal(r.firstWins, false);
  assert.equal(r.winningMove, 0);
});

test('coin-change-game n 非 (m+1) 倍数时先手必胜', () => {
  // n=11,m=4 → 11%5=1 → 必胜，取 1
  const r = coinChangeGame(11, 4);
  assert.equal(r.firstWins, true);
  assert.equal(r.winningMove, 1);
});

test('coin-change-game 必胜取法使剩余为 (m+1) 倍数', () => {
  const cases: Array<[number, number]> = [
    [11, 4],
    [7, 3],
    [13, 5],
    [1, 4],
    [3, 2],
  ];
  for (const [n, m] of cases) {
    const r = coinChangeGame(n, m);
    if (r.firstWins) {
      const remain = n - r.winningMove;
      assert.equal(
        remain % (m + 1),
        0,
        `n=${n} m=${m} 取 ${r.winningMove} 后剩 ${remain} 应为 ${m + 1} 倍数`,
      );
    }
  }
});

test('coin-change-game m=1 时奇偶决定胜负', () => {
  // m=1：每次只能取 1，奇数先手胜
  assert.equal(coinChangeGame(5, 1).firstWins, true);
  assert.equal(coinChangeGame(4, 1).firstWins, false);
});

test('coin-change-game 必胜取法使后继 SG=0', () => {
  const r = coinChangeGame(11, 4);
  assert.equal(r.sg[11 - r.winningMove], 0);
});

test('coin-change-game 钩子被调用', () => {
  let sgs = 0;
  let concludes = 0;
  let wins = 0;
  const hooks: CoinChangeGameHooks = {
    onSG: () => sgs++,
    onConclude: () => concludes++,
    onWinningMove: () => wins++,
  };
  coinChangeGame(11, 4, hooks);
  assert.equal(sgs, 11);
  assert.equal(concludes, 1);
  assert.equal(wins, 1);
});

test('coin-change-game n=0', () => {
  // 无硬币可取，先手无棋可走 → 必败
  const r = coinChangeGame(0, 4);
  assert.equal(r.firstWins, false);
});
