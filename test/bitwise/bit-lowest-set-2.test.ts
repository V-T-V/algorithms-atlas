import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lowestSetBit } from '../../src/algorithms/bitwise/bit-lowest-set-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-lowest-set-2/trace.ts';
test('lowestSetBit 正确', () => {
  assert.equal(lowestSetBit(0b10100), 0b100);
  assert.equal(lowestSetBit(0b10000), 16);
  assert.equal(lowestSetBit(0b11), 1);
  assert.equal(lowestSetBit(1), 1);
  assert.equal(lowestSetBit(0), 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
