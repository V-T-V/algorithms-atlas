import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPow2Bit } from '../../src/algorithms/bitwise/bit-is-pow2-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-is-pow2-2/trace.ts';
test('isPow2Bit 正确', () => {
  assert.equal(isPow2Bit(0), false);
  assert.equal(isPow2Bit(1), true);
  assert.equal(isPow2Bit(2), true);
  assert.equal(isPow2Bit(3), false);
  assert.equal(isPow2Bit(16), true);
  assert.equal(isPow2Bit(255), false);
  assert.equal(isPow2Bit(256), true);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
