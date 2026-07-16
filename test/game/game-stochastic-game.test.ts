import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameStochasticGame } from '../../src/algorithms/game/game-stochastic-game/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-stochastic-game/trace.ts';

test('单状态自环：V* = maximin / (1-γ)', () => {
  const r = gameStochasticGame(
    [
      [2, 0],
      [0, 1],
    ],
    0.9,
  );
  // maximin = max(min(2,0), min(0,1)) = max(0, 0) = 0；V* = 0/(1-0.9) = 0
  assert.ok(Math.abs(r.value - 0) < 1e-6);
});

test('maximin=1, γ=0.5 → V*=2', () => {
  const r = gameStochasticGame(
    [
      [1, 1],
      [1, 1],
    ],
    0.5,
  );
  assert.ok(Math.abs(r.value - 2) < 1e-6);
});

test('γ 越界拒绝', () => {
  assert.throws(() => gameStochasticGame([[1]], 1.5));
  assert.throws(() => gameStochasticGame([[1]], 0));
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
