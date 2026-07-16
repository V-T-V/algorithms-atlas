import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clearBit } from '../../src/algorithms/bitwise/bit-clear-bit-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-clear-bit-2/trace.ts';
test('clearBit 正确', () => {
  assert.equal(clearBit(0b1111, 0), 0b1110);
  assert.equal(clearBit(0b1010, 3), 0b0010);
  assert.equal(clearBit(0b1000, 3), 0);
  assert.equal(clearBit(0xff, 4), 0xef);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
