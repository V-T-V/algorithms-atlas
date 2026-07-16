import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameAuction } from '../../src/algorithms/game/game-auction/impl.ts';

test('game-auction 最高出价者赢', () => {
  const r = gameAuction([30, 50, 45], [60, 55, 50]);
  assert.equal(r.winner, 1);
  assert.equal(r.payoffs[1], 5);
  assert.equal(r.payoffs[0], 0);
});

test('game-auction 平局取最早', () => {
  const r = gameAuction([40, 40], [50, 50]);
  assert.equal(r.winner, 0);
});

test('game-auction 收益和为赢家净收益', () => {
  const r = gameAuction([10, 20], [30, 25]);
  assert.equal(r.winner, 1);
  assert.equal(r.payoffs[1], 5);
  assert.equal(
    r.payoffs.reduce((a, b) => a + b, 0),
    5,
  );
});
