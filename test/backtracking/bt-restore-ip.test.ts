import { test } from 'node:test';
import assert from 'node:assert/strict';
import { restoreIpAddresses } from '../../src/algorithms/backtracking/bt-restore-ip/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-restore-ip/trace.ts';
test('restoreIpAddresses 正确', () => {
  assert.deepEqual(restoreIpAddresses('25525511135'), ['255.255.11.135', '255.255.111.35']);
  assert.deepEqual(restoreIpAddresses('0000'), ['0.0.0.0']);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
