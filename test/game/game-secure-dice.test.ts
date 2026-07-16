import { test } from 'node:test';
import assert from 'node:assert/strict';
import { secureDice } from '../../src/algorithms/game/game-secure-dice/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-secure-dice/trace.ts';
test('安全骰子返回 6 个 EV', () => {
  const r = secureDice();
  assert.equal(r.evByM.length, 6);
  assert.ok(r.bestEv > 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
