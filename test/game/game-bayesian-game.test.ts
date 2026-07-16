import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameBayesianGame } from '../../src/algorithms/game/game-bayesian-game/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-bayesian-game/trace.ts';

test('给定 a2=0，每类型选收益最大的动作', () => {
  const P1 = [
    [
      [3, 0],
      [0, 1],
    ],
    [
      [2, 0],
      [0, 2],
    ],
  ];
  const r = gameBayesianGame(P1, [0.5, 0.5], 0);
  assert.deepEqual(r.bestActions, [0, 0]);
  assert.deepEqual(r.expectedPayoffs, [3, 2]);
});

test('总期望按先验加权', () => {
  const P1 = [
    [
      [3, 0],
      [0, 1],
    ],
    [
      [2, 0],
      [0, 2],
    ],
  ];
  const r = gameBayesianGame(P1, [0.6, 0.4], 0);
  assert.ok(Math.abs(r.totalExpected - (0.6 * 3 + 0.4 * 2)) < 1e-9);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
