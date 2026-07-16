import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openLock } from '../../src/algorithms/network/net-open-the-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-open-the-lock/trace.ts';
test('openLock 正确', () => {
  assert.equal(openLock(['0201', '0101', '0102', '1212', '2002'], '0202'), 6);
  assert.equal(openLock(['8888'], '0009'), 1);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
