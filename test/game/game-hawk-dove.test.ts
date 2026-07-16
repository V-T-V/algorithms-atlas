import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameHawkDove } from '../../src/algorithms/game/game-hawk-dove/impl.ts';

test('game-hawk-dove 两个不对称纯纳什', () => {
  const r = gameHawkDove(50, 100);
  assert.equal(r.nashCells.length, 2);
  assert.ok(r.nashCells.some(([a, b]) => a === 0 && b === 1));
  assert.ok(r.nashCells.some(([a, b]) => a === 1 && b === 0));
});

test('game-hawk-dove ESS 鹰频率 = V/C', () => {
  assert.ok(Math.abs(gameHawkDove(50, 100).essHawkFreq - 0.5) < 1e-9);
  assert.ok(Math.abs(gameHawkDove(30, 100).essHawkFreq - 0.3) < 1e-9);
});
