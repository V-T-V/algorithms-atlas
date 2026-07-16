import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sprt } from '../../src/algorithms/game/game-sprt/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-sprt/trace.ts';
test('SPRT 高频 1 接受 H1', () => {
  const r = sprt([1, 1, 1, 1, 1, 1], 0.3, 0.6, 0.05, 0.05);
  assert.equal(r.acceptH1, true);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
