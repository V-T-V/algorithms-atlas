import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPow4Bit } from '../../src/algorithms/bitwise/bit-is-pow4-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-is-pow4-2/trace.ts';
test('isPow4Bit 正确', () => {
  assert.equal(isPow4Bit(0), false);
  assert.equal(isPow4Bit(1), true);
  assert.equal(isPow4Bit(2), false);
  assert.equal(isPow4Bit(4), true);
  assert.equal(isPow4Bit(8), false);
  assert.equal(isPow4Bit(16), true);
  assert.equal(isPow4Bit(64), true);
  assert.equal(isPow4Bit(256), true);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
