import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gamePrisonersDilemma } from '../../src/algorithms/game/game-prisoners-dilemma/impl.ts';

test('game-prisoners-dilemma 唯一纳什为 (D,D)', () => {
  const r = gamePrisonersDilemma();
  assert.equal(r.nashCells.length, 1);
  assert.deepEqual(r.nashCells[0], [1, 1]);
});

test('game-prisoners-dilemma 社会最优为 (C,C)', () => {
  const r = gamePrisonersDilemma();
  assert.deepEqual(r.socialOptimum, [0, 0]);
});

test('game-prisoners-dilemma 纳什劣于社会最优', () => {
  const r = gamePrisonersDilemma();
  // 唯一纳什 (D,D)=[1,1] 不等于社会最优 (C,C)=[0,0]
  const nash = r.nashCells[0];
  assert.notDeepEqual(nash, r.socialOptimum);
});
