import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countTrailingOnes } from '../../src/algorithms/bitwise/bit-trailing-ones-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-trailing-ones-2/trace.ts';
test('countTrailingOnes 正确', () => {
  assert.equal(countTrailingOnes(0b1011), 2);
  assert.equal(countTrailingOnes(0b111), 3);
  assert.equal(countTrailingOnes(0b1000), 0);
  assert.equal(countTrailingOnes(0), 0);
  assert.equal(countTrailingOnes(-1), 32);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
