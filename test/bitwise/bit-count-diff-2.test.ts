import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hamming } from '../../src/algorithms/bitwise/bit-count-diff-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-count-diff-2/trace.ts';
test('hamming 正确', () => {
  assert.equal(hamming(1, 4), 2);
  assert.equal(hamming(7, 10), 3);
  assert.equal(hamming(0, 0), 0);
  assert.equal(hamming(255, 0), 8);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
