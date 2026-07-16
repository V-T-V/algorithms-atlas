import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mentalPoker } from '../../src/algorithms/game/game-mental-poker/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-mental-poker/trace.ts';
test('心理扑克发出 2 张', () => {
  const hand = mentalPoker(5, 23, 5, 7);
  assert.equal(hand.length, 2);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
