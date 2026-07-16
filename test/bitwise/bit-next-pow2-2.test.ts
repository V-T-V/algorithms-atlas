import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextPow2 } from '../../src/algorithms/bitwise/bit-next-pow2-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-next-pow2-2/trace.ts';
test('nextPow2 正确', () => {
  assert.equal(nextPow2(1), 1);
  assert.equal(nextPow2(3), 4);
  assert.equal(nextPow2(5), 8);
  assert.equal(nextPow2(9), 16);
  assert.equal(nextPow2(16), 16);
  assert.equal(nextPow2(33), 64);
  assert.equal(nextPow2(1000), 1024);
  assert.equal(nextPow2(0), 1);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
