import { test } from 'node:test';
import assert from 'node:assert/strict';
import { popcountRange } from '../../src/algorithms/bitwise/bit-popcount-range-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-popcount-range-2/trace.ts';
test('popcountRange 正确', () => {
  assert.equal(popcountRange(0, 7), 12); // 0+1+1+2+1+2+2+3
  assert.equal(popcountRange(1, 4), 5); // 1+1+2+1
  assert.equal(popcountRange(5, 5), 2);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
