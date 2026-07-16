import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interleave } from '../../src/algorithms/bitwise/bit-interleave-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-interleave-2/trace.ts';
test('interleave 正确', () => {
  assert.equal(interleave(1, 1), 0b11);
  assert.equal(interleave(3, 3), 0b1111);
  assert.equal(interleave(0, 7), 0b101010);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
