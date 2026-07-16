import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dictatorGame } from '../../src/algorithms/game/game-dictator-game/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-dictator-game/trace.ts';
test('收益守恒', () => {
  const r = dictatorGame(10, 3);
  assert.equal(r.dictator + r.recipient, 10);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
