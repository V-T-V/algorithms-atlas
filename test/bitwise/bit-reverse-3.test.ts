import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reverseNibble } from '../../src/algorithms/bitwise/bit-reverse-3/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-reverse-3/trace.ts';
test('reverseNibble 正确', () => {
  assert.equal(reverseNibble(0), 0);
  assert.equal(reverseNibble(1), 0b1000);
  assert.equal(reverseNibble(5), 0b1010);
  assert.equal(reverseNibble(10), 0b0101);
  assert.equal(reverseNibble(15), 15);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
