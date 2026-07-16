import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bilateralTrade } from '../../src/algorithms/game/game-bilateral-trade/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-bilateral-trade/trace.ts';
test('有效价格促成交易', () => {
  const r = bilateralTrade(10, 4, [7]);
  assert.ok(r.bestWelfare > 0);
});
test('价格过低不成交', () => {
  const r = bilateralTrade(10, 4, [2]);
  assert.equal(r.bestWelfare, 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
