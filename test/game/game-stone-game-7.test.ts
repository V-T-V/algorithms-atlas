import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameStoneGame7 } from '../../src/algorithms/game/game-stone-game-7/impl.ts';

test('game-stone-game-7 [5,3,1,4,2] = 6', () => {
  assert.equal(gameStoneGame7([5, 3, 1, 4, 2]), 6);
});

test('game-stone-game-7 [7,90,5,1,100,10,10,2] = 122', () => {
  assert.equal(gameStoneGame7([7, 90, 5, 1, 100, 10, 10, 2]), 122);
});

test('game-stone-game-7 两元素', () => {
  // [2,5]：先手移除 2 得 sum(1,1)=5，后手面对 [5] 无法得分 → 分差 5
  assert.equal(gameStoneGame7([2, 5]), 5);
});

test('game-stone-game-7 单元素为 0', () => {
  assert.equal(gameStoneGame7([4]), 0);
});
