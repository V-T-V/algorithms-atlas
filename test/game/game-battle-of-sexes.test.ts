import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameBattleOfSexes } from '../../src/algorithms/game/game-battle-of-sexes/impl.ts';

test('game-battle-of-sexes 两个纯纳什', () => {
  const r = gameBattleOfSexes();
  assert.equal(r.nashCells.length, 2);
  assert.ok(r.nashCells.some(([a, b]) => a === 0 && b === 0));
  assert.ok(r.nashCells.some(([a, b]) => a === 1 && b === 1));
});

test('game-battle-of-sexes 混合概率', () => {
  const r = gameBattleOfSexes();
  assert.ok(Math.abs(r.mixedRowProb - 0.6) < 1e-9);
  assert.ok(Math.abs(r.mixedColProb - 0.4) < 1e-9);
});
