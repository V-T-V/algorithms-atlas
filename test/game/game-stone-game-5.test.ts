import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameStoneGame5 } from '../../src/algorithms/game/game-stone-game-5/impl.ts';

test('game-stone-game-5 [6,2,3,4,5,5] = 18', () => {
  assert.equal(gameStoneGame5([6, 2, 3, 4, 5, 5]), 18);
});

test('game-stone-game-5 [7,7,7,7,7,7,7] = 28', () => {
  assert.equal(gameStoneGame5([7, 7, 7, 7, 7, 7, 7]), 28);
});

test('game-stone-game-5 两元素', () => {
  assert.equal(gameStoneGame5([3, 5]), 3);
});

test('game-stone-game-5 单元素为 0', () => {
  assert.equal(gameStoneGame5([9]), 0);
});
