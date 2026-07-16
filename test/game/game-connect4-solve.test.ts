import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameConnect4Solve } from '../../src/algorithms/game/game-connect4-solve/impl.ts';

test('game-connect4-solve 空棋盘返回合法列', () => {
  const r = gameConnect4Solve([], 4);
  assert.ok(r.bestCol >= 0 && r.bestCol <= 6);
});

test('game-connect4-solve 即将获胜应选致胜列', () => {
  // 红在底行 col0,col1,col2，下 col3 致胜
  const board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 0],
  ];
  const r = gameConnect4Solve(board, 2);
  assert.equal(r.bestCol, 3);
  assert.ok(r.value > 0);
});

test('game-connect4-solve 返回价值数字', () => {
  const r = gameConnect4Solve([], 3);
  assert.equal(typeof r.value, 'number');
});
