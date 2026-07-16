import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rangeOr } from '../../src/algorithms/bitwise/bit-or-range-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-or-range-2/trace.ts';
test('rangeOr 正确', () => {
  assert.equal(rangeOr(5, 7), 7);
  assert.equal(rangeOr(8, 11), 15);
  assert.equal(rangeOr(16, 23), 31);
  assert.equal(rangeOr(9, 9), 9);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
