import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameSubsetGame } from '../../src/algorithms/game/game-subset-game/impl.ts';

test('game-subset-game S={1,2} 退化为模 3', () => {
  // SG 周期 0,1,2,0,1,2,...
  assert.equal(gameSubsetGame([3], [1, 2]), 0); // 3 mod 3 = 0 必败
  assert.equal(gameSubsetGame([4], [1, 2]), 1);
});

test('game-subset-game 两堆相同异或为 0', () => {
  assert.equal(gameSubsetGame([5, 5], [1, 3, 4]), 0);
});

test('game-subset-game 返回整数', () => {
  assert.ok(Number.isInteger(gameSubsetGame([7], [1, 3, 4])));
});
