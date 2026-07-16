import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nimGame, type NimGameHooks } from '../../src/algorithms/game/nim-game/impl.ts';

test('nim-game 必败态：nim-sum = 0（如相同两堆）', () => {
  // [5,5] → 5⊕5=0 → 先手必败
  const r = nimGame([5, 5]);
  assert.equal(r.nimSum, 0);
  assert.equal(r.firstPlayerWins, false);
  assert.equal(r.winningMove, null);
});

test('nim-game 必胜态：nim-sum ≠ 0', () => {
  // [3,4,5] → 3⊕4⊕5 = 011⊕100⊕101 = 010 = 2 ≠ 0 → 先手必胜
  const r = nimGame([3, 4, 5]);
  assert.equal(r.nimSum, 2);
  assert.equal(r.firstPlayerWins, true);
  assert.ok(r.winningMove !== null);
});

test('nim-game 必胜取法使取后 nim-sum 归零', () => {
  const cases: number[][] = [
    [3, 4, 5],
    [1, 2, 3],
    [7, 11, 13],
    [1, 1, 1, 1, 1],
    [10, 0, 5],
  ];
  for (const piles of cases) {
    const r = nimGame(piles);
    if (r.firstPlayerWins && r.winningMove) {
      const [idx, take] = r.winningMove;
      const after = [...piles];
      after[idx] = piles[idx]! - take;
      // 取后 nim-sum 应为 0
      const afterSum = after.reduce((acc, v) => acc ^ v, 0);
      assert.equal(afterSum, 0, `取法 [${idx}, ${take}] 取后 nim-sum 应为 0，实际 ${afterSum}`);
      // 取走数量合法（≥1 且 ≤ 该堆）
      assert.ok(take >= 1 && take <= piles[idx]!, `取走数量 ${take} 不合法`);
    }
  }
});

test('nim-game 全 0 堆（已终局）必败', () => {
  const r = nimGame([0, 0, 0]);
  assert.equal(r.nimSum, 0);
  assert.equal(r.firstPlayerWins, false);
});

test('nim-game 经典结论：两堆相等先手负，不等先手胜', () => {
  // [3,7] 不等 → 3⊕7=4≠0 → 必胜
  assert.equal(nimGame([3, 7]).firstPlayerWins, true);
  // [6,6] 相等 → 0 → 必败
  assert.equal(nimGame([6, 6]).firstPlayerWins, false);
});

test('nim-game nim-sum 计算正确', () => {
  assert.equal(nimGame([1, 2, 3]).nimSum, 0); // 01⊕10⊕11=00
  assert.equal(nimGame([1, 2, 4]).nimSum, 7); // 001⊕010⊕100=111
  assert.equal(nimGame([15, 15]).nimSum, 0);
});

test('nim-game 钩子被调用', () => {
  let nimsums = 0;
  let concludes = 0;
  let wins = 0;
  const hooks: NimGameHooks = {
    onNimSum: () => nimsums++,
    onConclude: () => concludes++,
    onWinningMove: () => wins++,
  };
  nimGame([3, 4, 5], hooks);
  assert.equal(nimsums, 1);
  assert.equal(concludes, 1);
  assert.equal(wins, 1); // 必胜态会给出取法
});

test('nim-game 钩子被调用（必败态无 onWinningMove）', () => {
  let wins = 0;
  nimGame([5, 5], { onWinningMove: () => wins++ });
  assert.equal(wins, 0, '必败态不应触发 onWinningMove');
});
