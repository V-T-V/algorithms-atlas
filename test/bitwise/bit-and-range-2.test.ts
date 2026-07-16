import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rangeAnd } from '../../src/algorithms/bitwise/bit-and-range-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-and-range-2/trace.ts';
test('rangeAnd 正确', () => {
  assert.equal(rangeAnd(5, 7), 4);
  assert.equal(rangeAnd(12, 15), 12);
  assert.equal(rangeAnd(16, 19), 16);
  assert.equal(rangeAnd(10, 10), 10);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
