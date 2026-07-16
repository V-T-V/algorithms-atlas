import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameTictactoePerfect } from '../../src/algorithms/game/game-tictactoe-perfect/impl.ts';

test('game-tictactoe-perfect 空棋盘应为平局(价值 0)', () => {
  const r = gameTictactoePerfect([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.equal(r.value, 0);
  assert.ok(r.bestMove >= 0);
});

test('game-tictactoe-perfect X 即将获胜应找到', () => {
  // X 在 0,1，下 2 即胜
  const r = gameTictactoePerfect([1, 1, 0, 0, 2, 0, 2, 0, 0]);
  assert.equal(r.bestMove, 2);
});

test('game-tictactoe-perfect 终局 bestMove=-1', () => {
  const r = gameTictactoePerfect([1, 2, 0, 1, 2, 0, 1, 0, 0]); // X 第 0,3,6 列胜
  assert.equal(r.bestMove, -1);
  assert.equal(r.value, 10);
});

test('game-tictactoe-perfect 最优应不败', () => {
  const r = gameTictactoePerfect([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.ok(r.value >= 0, 'X 先手不应输');
});
