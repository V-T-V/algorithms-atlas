import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameZeroSum } from '../../src/algorithms/game/game-zero-sum/impl.ts';

test('game-zero-sum 有鞍点', () => {
  const r = gameZeroSum([
    [4, 1],
    [2, 6],
  ]);
  // maximin: max(1,2)=2; minimax: min(4,6)=4 → 无鞍点
  assert.equal(r.hasSaddle, false);
});

test('game-zero-sum 经典鞍点', () => {
  const r = gameZeroSum([
    [3, 2],
    [1, 4],
  ]);
  // maximin: max(2,1)=2; minimax: min(3,4)=3 → 无鞍点
  assert.equal(r.hasSaddle, false);
});

test('game-zero-sum 单元素', () => {
  const r = gameZeroSum([[7]]);
  assert.equal(r.hasSaddle, true);
  assert.equal(r.value, 7);
});

test('game-zero-sum 鞍点存在', () => {
  const r = gameZeroSum([
    [5, 1],
    [3, 2],
  ]);
  // maximin: max(1,2)=2; minimax: min(5,2)=2 → 鞍点值 2
  assert.equal(r.hasSaddle, true);
  assert.equal(r.value, 2);
});
