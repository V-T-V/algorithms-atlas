import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameCardGame } from '../../src/algorithms/game/game-card-game/impl.ts';

test('game-card-game 同花顺胜四条', () => {
  assert.equal(gameCardGame(['Ah', 'Kh', 'Qh', 'Jh', 'Th'], ['9s', '9d', '9h', '9c', '2s']), 1);
});

test('game-card-game 四条胜葫芦', () => {
  assert.equal(gameCardGame(['9s', '9d', '9h', '9c', '2s'], ['Ks', 'Kd', 'Kh', '3c', '3s']), 1);
});

test('game-card-game 高牌比点数', () => {
  assert.equal(gameCardGame(['As', '5d', '4c', '3h', '2s'], ['Ks', 'Qd', 'Jc', '9h', '8s']), 1);
});

test('game-card-game 完全相同平局', () => {
  assert.equal(gameCardGame(['As', 'Kd', 'Qc', 'Jh', '9s'], ['Ah', 'Ks', 'Qd', 'Jc', '9h']), 0);
});
