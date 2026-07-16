import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameVickrey } from '../../src/algorithms/game/game-vickrey/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-vickrey/trace.ts';

test('维克里：诚实出价 → 中标者付次高价', () => {
  const r = gameVickrey([12, 25, 18], [12, 25, 18]);
  assert.equal(r.winnerIdx, 1);
  assert.equal(r.price, 18);
});

test('维克里：诚实出价收益非负', () => {
  const r = gameVickrey([12, 25, 18], [12, 25, 18]);
  for (const p of r.payoffs) assert.ok(p >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
