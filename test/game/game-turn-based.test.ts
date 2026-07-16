import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameTurnBased } from '../../src/algorithms/game/game-turn-based/impl.ts';

test('game-turn-based maxTake=3 经典 Bash', () => {
  // 4 的倍数先手败
  assert.equal(gameTurnBased(4, 3), false);
  assert.equal(gameTurnBased(8, 3), false);
  assert.equal(gameTurnBased(5, 3), true);
});

test('game-turn-based maxTake=1 奇偶', () => {
  assert.equal(gameTurnBased(1, 1), true);
  assert.equal(gameTurnBased(2, 1), false);
  assert.equal(gameTurnBased(3, 1), true);
});

test('game-turn-based 返回布尔', () => {
  assert.equal(typeof gameTurnBased(10, 4), 'boolean');
});
