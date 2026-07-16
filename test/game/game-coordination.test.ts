import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameCoordination } from '../../src/algorithms/game/game-coordination/impl.ts';

test('game-coordination 两个纯纳什', () => {
  const r = gameCoordination();
  assert.equal(r.nashCells.length, 2);
  assert.ok(r.nashCells.some(([a, b]) => a === 0 && b === 0));
  assert.ok(r.nashCells.some(([a, b]) => a === 1 && b === 1));
});

test('game-coordination 帕累托占优为 (A,A)', () => {
  assert.deepEqual(gameCoordination().paretoDominant, [0, 0]);
});
