import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vcgAuction } from '../../src/algorithms/game/game-vickrey-clarke-groves/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-vickrey-clarke-groves/trace.ts';
test('VCG 价格等于第二高', () => {
  const r = vcgAuction([5, 8, 6]);
  assert.equal(r.winner, 1);
  assert.equal(r.price, 6);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
