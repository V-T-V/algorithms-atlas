import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stPetersburg } from '../../src/algorithms/game/game-st-petersburg/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-st-petersburg/trace.ts';
test('截断 EV = maxN', () => {
  const r = stPetersburg(10);
  assert.equal(r.ev, 10);
  assert.ok(r.logUtil > 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
