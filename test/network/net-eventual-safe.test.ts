import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eventualSafeNodes } from '../../src/algorithms/network/net-eventual-safe/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-eventual-safe/trace.ts';
test('eventualSafeNodes 正确', () => {
  assert.deepEqual(eventualSafeNodes([[1, 2], [2, 3], [5], [0], [5], [], []]), [2, 4, 5, 6]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
