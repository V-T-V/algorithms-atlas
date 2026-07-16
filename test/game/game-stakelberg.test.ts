import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stackelberg } from '../../src/algorithms/game/game-stakelberg/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-stakelberg/trace.ts';
test('领导者产量是跟随者两倍', () => {
  const r = stackelberg(10, 1, 2);
  assert.ok(Math.abs(r.q1 - 2 * r.q2) < 1e-9);
});
test('领导者利润更高', () => {
  const r = stackelberg(10, 1, 2);
  assert.ok(r.profit1 > r.profit2);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
