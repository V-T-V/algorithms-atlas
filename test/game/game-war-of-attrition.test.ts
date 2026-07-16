import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameWarOfAttrition } from '../../src/algorithms/game/game-war-of-attrition/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-war-of-attrition/trace.ts';

test('玩家1坚持更久则胜', () => {
  const r = gameWarOfAttrition(5, 3, 8);
  assert.equal(r.winner, 0);
  assert.equal(r.payoffs[0], 8 - 3);
  assert.equal(r.payoffs[1], -3);
});

test('并列则平分 V', () => {
  const r = gameWarOfAttrition(3, 3, 8);
  assert.equal(r.winner, -1);
  assert.equal(r.payoffs[0], 4 - 3);
  assert.equal(r.payoffs[1], 4 - 3);
});

test('负时间拒绝', () => {
  assert.throws(() => gameWarOfAttrition(-1, 2, 5));
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
