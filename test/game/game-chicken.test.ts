import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameChicken } from '../../src/algorithms/game/game-chicken/impl.ts';

test('game-chicken 两个不对称纯纳什', () => {
  const r = gameChicken();
  assert.equal(r.nashCells.length, 2);
  assert.ok(r.nashCells.some(([a, b]) => a === 0 && b === 1));
  assert.ok(r.nashCells.some(([a, b]) => a === 1 && b === 0));
});

test('game-chicken 混合概率 1/7', () => {
  assert.ok(Math.abs(gameChicken().mixedProb - 1 / 7) < 1e-9);
});
