import { test } from 'node:test';
import assert from 'node:assert/strict';
import { competitiveRatio } from '../../src/algorithms/game/game-competitive-ratio/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-competitive-ratio/trace.ts';
test('竞争比正确', () => {
  const r = competitiveRatio([10, 8, 20], [5, 8, 4]);
  assert.equal(r.idx, 2);
  assert.ok(r.maxRatio > 4);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
