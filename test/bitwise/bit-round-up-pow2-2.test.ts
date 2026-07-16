import { test } from 'node:test';
import assert from 'node:assert/strict';
import { alignUp } from '../../src/algorithms/bitwise/bit-round-up-pow2-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-round-up-pow2-2/trace.ts';
test('alignUp 正确', () => {
  assert.equal(alignUp(10, 8), 16);
  assert.equal(alignUp(16, 8), 16);
  assert.equal(alignUp(17, 16), 32);
  assert.equal(alignUp(0, 4), 0);
});
test('alignUp 非幂报错', () => {
  assert.throws(() => alignUp(10, 6), RangeError);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
