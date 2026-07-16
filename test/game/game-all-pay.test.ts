import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameAllPay } from '../../src/algorithms/game/game-all-pay/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-all-pay/trace.ts';

test('全付：中标者得估值-出价，失败者付 -出价', () => {
  const r = gameAllPay([5, 8, 6], [10, 15, 12]);
  assert.equal(r.winnerIdx, 1);
  assert.equal(r.payoffs[0], -5);
  assert.equal(r.payoffs[1], 15 - 8);
  assert.equal(r.payoffs[2], -6);
});

test('全付：总付出 = 所有出价之和', () => {
  const r = gameAllPay([5, 8, 6], [10, 15, 12]);
  assert.equal(r.totalPaid, 19);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
