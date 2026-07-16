import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameStoneGame6 } from '../../src/algorithms/game/game-stone-game-6/impl.ts';

test('game-stone-game-6 例 1 Alice 胜', () => {
  assert.equal(gameStoneGame6([1, 3], [2, 1]), 1);
});

test('game-stone-game-6 例 2 平局', () => {
  assert.equal(gameStoneGame6([1, 2], [3, 1]), 0);
});

test('game-stone-game-6 例 3 Bob 胜', () => {
  assert.equal(gameStoneGame6([2, 4, 3], [1, 6, 7]), -1);
});

test('game-stone-game-6 返回值在 {-1,0,1}', () => {
  const r = gameStoneGame6([5, 5, 5], [5, 5, 5]);
  assert.ok(r === -1 || r === 0 || r === 1);
});
