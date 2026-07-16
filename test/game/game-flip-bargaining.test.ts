import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flipBargaining } from '../../src/algorithms/game/game-flip-bargaining/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-flip-bargaining/trace.ts';
test('给足 fallback 则接受', () => {
  const r = flipBargaining(0.6, 0.5);
  assert.equal(r.accepted, true);
  assert.ok(Math.abs(r.bPayoff - 0.6) < 1e-9);
});
test('给太少则拒绝', () => {
  const r = flipBargaining(0.2, 0.5);
  assert.equal(r.accepted, false);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
