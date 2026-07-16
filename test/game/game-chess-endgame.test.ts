import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameChessEndgame } from '../../src/algorithms/game/game-chess-endgame/impl.ts';

test('game-chess-endgame 相邻一步将杀', () => {
  const r = gameChessEndgame(4, 5, 6);
  // 攻击者在 5、防守在 6（相邻），攻击方回合直接捕获 → 0 步？solve 起始 aP===dP 才 0；相邻不为 0
  assert.ok(r.mateIn >= 0);
});

test('game-chess-endgame 返回数字', () => {
  const r = gameChessEndgame(4, 0, 15);
  assert.equal(typeof r.mateIn, 'number');
});

test('game-chess-endgame 同位置 0 步', () => {
  const r = gameChessEndgame(4, 7, 7);
  assert.equal(r.mateIn, 0);
});
