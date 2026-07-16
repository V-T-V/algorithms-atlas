import { test } from 'node:test';
import assert from 'node:assert/strict';
import { meanPayoff } from '../../src/algorithms/game/game-mean-payoff/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-mean-payoff/trace.ts';
test('单环均值正确', () => {
  const v = meanPayoff(3, [
    [0, 1, 1],
    [1, 2, 2],
    [2, 0, 3],
  ]);
  assert.ok(Math.abs(v - 2) < 1e-9);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
