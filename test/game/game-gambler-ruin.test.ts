import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gamblerRuin } from '../../src/algorithms/game/game-gambler-ruin/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-gambler-ruin/trace.ts';
test('公平赌局破产概率线性', () => {
  assert.ok(Math.abs(gamblerRuin(5, 10, 0.5) - 0.5) < 1e-9);
});
test('本金 0 必破产', () => {
  assert.equal(gamblerRuin(0, 10, 0.4), 1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
