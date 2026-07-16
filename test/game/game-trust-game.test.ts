import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trustGame } from '../../src/algorithms/game/game-trust-game/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-trust-game/trace.ts';
test('不送不返时各方持原禀赋', () => {
  const r = trustGame(10, 0, 3, 0);
  assert.equal(r.sender, 10);
  assert.equal(r.trustee, 10);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
