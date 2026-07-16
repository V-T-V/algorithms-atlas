import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countLeadingOnes } from '../../src/algorithms/bitwise/bit-leading-ones-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-leading-ones-2/trace.ts';
test('countLeadingOnes 正确', () => {
  assert.equal(countLeadingOnes(0xffffffff), 32);
  assert.equal(countLeadingOnes(0), 0);
  assert.equal(countLeadingOnes(-1), 32);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
