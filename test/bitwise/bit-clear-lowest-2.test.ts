import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clearLowestBit } from '../../src/algorithms/bitwise/bit-clear-lowest-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-clear-lowest-2/trace.ts';
test('clearLowestBit 正确', () => {
  assert.equal(clearLowestBit(0b00110010), 0b00110000);
  assert.equal(clearLowestBit(0b10000000), 0);
  assert.equal(clearLowestBit(0b00010001), 0b00010000);
  assert.equal(clearLowestBit(1), 0);
  assert.equal(clearLowestBit(0), 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
