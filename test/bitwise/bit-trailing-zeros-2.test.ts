import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ctz32 } from '../../src/algorithms/bitwise/bit-trailing-zeros-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-trailing-zeros-2/trace.ts';
test('ctz32 正确', () => {
  assert.equal(ctz32(0), 32);
  assert.equal(ctz32(1), 0);
  assert.equal(ctz32(2), 1);
  assert.equal(ctz32(4), 2);
  assert.equal(ctz32(8), 3);
  assert.equal(ctz32(12), 2);
  assert.equal(ctz32(0x10000), 16);
  assert.equal(ctz32(0x80000000), 31);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
