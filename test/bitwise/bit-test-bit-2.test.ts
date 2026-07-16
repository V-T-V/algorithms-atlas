import { test } from 'node:test';
import assert from 'node:assert/strict';
import { testBit } from '../../src/algorithms/bitwise/bit-test-bit-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-test-bit-2/trace.ts';
test('testBit 正确', () => {
  assert.equal(testBit(0b1010, 1), true);
  assert.equal(testBit(0b1010, 0), false);
  assert.equal(testBit(0xff, 3), true);
  assert.equal(testBit(0, 4), false);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
