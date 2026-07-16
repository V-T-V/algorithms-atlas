import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameStagHunt } from '../../src/algorithms/game/game-stag-hunt/impl.ts';

test('game-stag-hunt 两个纯纳什', () => {
  const r = gameStagHunt();
  assert.equal(r.nashCells.length, 2);
  assert.ok(r.nashCells.some(([a, b]) => a === 0 && b === 0));
  assert.ok(r.nashCells.some(([a, b]) => a === 1 && b === 1));
});

test('game-stag-hunt 收益占优为 (Stag,Stag)', () => {
  assert.deepEqual(gameStagHunt().payoffDominant, [0, 0]);
});

test('game-stag-hunt 风险占优为 (Hare,Hare)', () => {
  assert.deepEqual(gameStagHunt().riskDominant, [1, 1]);
});
