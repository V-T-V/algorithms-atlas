import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  gameFirstPrice,
  firstPriceEquilibriumBid,
} from '../../src/algorithms/game/game-first-price/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-first-price/trace.ts';

test('第一价格：中标者付自己的最高出价', () => {
  const r = gameFirstPrice([8, 12, 10], [10, 15, 12]);
  assert.equal(r.winnerIdx, 1);
  assert.equal(r.payment, 12);
});

test('均衡出价公式 v*(n-1)/n', () => {
  assert.equal(firstPriceEquilibriumBid(10, 2), 5);
  assert.equal(firstPriceEquilibriumBid(10, 3), (10 * 2) / 3);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
