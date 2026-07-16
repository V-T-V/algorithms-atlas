import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameUltimatum } from '../../src/algorithms/game/game-ultimatum/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-ultimatum/trace.ts';

test('接受提案：按提案分配', () => {
  const r = gameUltimatum(100, 50, 40);
  assert.equal(r.accepted, true);
  assert.equal(r.proposerPayoff, 50);
  assert.equal(r.responderPayoff, 50);
});

test('拒绝提案：双方得零', () => {
  const r = gameUltimatum(100, 10, 40);
  assert.equal(r.accepted, false);
  assert.equal(r.proposerPayoff, 0);
  assert.equal(r.responderPayoff, 0);
});

test('等于阈值时接受', () => {
  const r = gameUltimatum(100, 40, 40);
  assert.equal(r.accepted, true);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
