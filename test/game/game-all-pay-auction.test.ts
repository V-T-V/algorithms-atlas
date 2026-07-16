import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allPayAuction } from '../../src/algorithms/game/game-all-pay-auction/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-all-pay-auction/trace.ts';
test('最高报价者获胜', () => {
  const r = allPayAuction([2, 5, 3], 10);
  assert.equal(r.winner, 1);
  assert.ok(r.payoffs[1]! > 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
