import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canReach } from '../../src/algorithms/network/net-jump-game-3/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-jump-game-3/trace.ts';
test('canReach 正确', () => {
  assert.equal(canReach([4, 2, 3, 0, 3, 1, 2], 5), true);
  assert.equal(canReach([3, 0, 2, 1, 2], 2), false);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
