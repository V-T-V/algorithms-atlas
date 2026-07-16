import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cournotDuopoly } from '../../src/algorithms/game/game-cournot/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-cournot/trace.ts';
test('对称古诺 q1=q2', () => {
  const r = cournotDuopoly(10, 1, 2, 2);
  assert.ok(Math.abs(r.q1 - r.q2) < 1e-9);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
