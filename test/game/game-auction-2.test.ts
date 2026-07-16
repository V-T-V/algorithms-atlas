import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameAuction2 } from '../../src/algorithms/game/game-auction-2/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-auction-2/trace.ts';

test('second-price: 中标者付次高价', () => {
  const r = gameAuction2([10, 25, 18], [12, 30, 20], 'second-price');
  assert.equal(r.winnerIdx, 1);
  assert.equal(r.payment, 18);
});

test('first-price: 中标者付自己的最高价', () => {
  const r = gameAuction2([10, 25, 18], [12, 30, 20], 'first-price');
  assert.equal(r.winnerIdx, 1);
  assert.equal(r.payment, 25);
});

test('all-pay: 失败者仍付自己的出价', () => {
  const r = gameAuction2([10, 25, 18], [12, 30, 20], 'all-pay');
  assert.equal(r.winnerIdx, 1);
  assert.equal(r.payoffs[0], -10);
  assert.equal(r.payoffs[1], 30 - 25);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
