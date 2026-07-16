import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minBit } from '../../src/algorithms/bitwise/bit-min-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-min-2/trace.ts';
test('minBit 正确', () => {
  assert.equal(minBit(3, 7), 3);
  assert.equal(minBit(9, 2), 2);
  assert.equal(minBit(5, 5), 5);
  assert.equal(minBit(-1, 4), -1);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
