import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lowMask } from '../../src/algorithms/bitwise/bit-mask-shift-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-mask-shift-2/trace.ts';
test('lowMask 正确', () => {
  assert.equal(lowMask(0), 0);
  assert.equal(lowMask(1), 1);
  assert.equal(lowMask(4), 0b1111);
  assert.equal(lowMask(8), 0xff);
  assert.equal(lowMask(16), 0xffff);
  assert.equal(lowMask(32), 0xffffffff);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
