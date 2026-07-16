import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signBit } from '../../src/algorithms/bitwise/bit-sign-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-sign-2/trace.ts';
test('signBit 正确', () => {
  assert.equal(signBit(-42), -1);
  assert.equal(signBit(-1), -1);
  assert.equal(signBit(0), 0);
  assert.equal(signBit(1), 1);
  assert.equal(signBit(99), 1);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
