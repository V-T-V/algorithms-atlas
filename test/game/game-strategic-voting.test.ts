import { test } from 'node:test';
import assert from 'node:assert/strict';
import { strategicVoting } from '../../src/algorithms/game/game-strategic-voting/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-strategic-voting/trace.ts';
test('策略投票返回赢家', () => {
  const r = strategicVoting([{ prefs: [0, 1, 2] }, { prefs: [1, 0, 2] }, { prefs: [2, 1, 0] }], 3);
  assert.ok(r.sincere >= 0 && r.strategic >= 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
