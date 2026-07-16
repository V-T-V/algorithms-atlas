import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxBit } from '../../src/algorithms/bitwise/bit-max-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-max-2/trace.ts';
test('maxBit 正确', () => {
  assert.equal(maxBit(3, 7), 7);
  assert.equal(maxBit(9, 2), 9);
  assert.equal(maxBit(5, 5), 5);
  assert.equal(maxBit(-1, 4), 4);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
