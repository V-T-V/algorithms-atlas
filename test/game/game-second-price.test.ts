import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameSecondPrice } from '../../src/algorithms/game/game-second-price/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-second-price/trace.ts';

test('第二价格：付次高价', () => {
  const r = gameSecondPrice([12, 25, 18], [12, 25, 18]);
  assert.equal(r.winnerIdx, 1);
  assert.equal(r.price, 18);
});

test('诚实出价收益非负', () => {
  const r = gameSecondPrice([12, 25, 18], [12, 25, 18]);
  for (const p of r.payoffs) assert.ok(p >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
