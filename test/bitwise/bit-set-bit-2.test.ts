import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setBit } from '../../src/algorithms/bitwise/bit-set-bit-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-set-bit-2/trace.ts';
test('setBit 正确', () => {
  assert.equal(setBit(0, 0), 1);
  assert.equal(setBit(0, 3), 8);
  assert.equal(setBit(0b1010, 1), 0b1010);
  assert.equal(setBit(0b1000, 2), 0b1100);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
