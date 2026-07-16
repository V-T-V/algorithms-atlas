import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameMatchingPenny } from '../../src/algorithms/game/game-matching-penny/impl.ts';

test('game-matching-penny 无纯策略纳什', () => {
  const r = gameMatchingPenny();
  assert.equal(r.hasPureNash, false);
  assert.equal(r.nashCells.length, 0);
});

test('game-matching-penny 混合概率为 0.5', () => {
  assert.equal(gameMatchingPenny().mixedProb, 0.5);
});
