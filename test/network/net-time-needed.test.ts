import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numOfMinutes } from '../../src/algorithms/network/net-time-needed/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-time-needed/trace.ts';
test('numOfMinutes 正确', () => {
  assert.equal(numOfMinutes(6, 2, [2, 2, -1, 2, 2, 2], [0, 0, 1, 0, 0, 0]), 1);
  assert.equal(numOfMinutes(1, 0, [-1], [0]), 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
