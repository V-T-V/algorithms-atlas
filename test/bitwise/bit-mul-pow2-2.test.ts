import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mulPow2 } from '../../src/algorithms/bitwise/bit-mul-pow2-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-mul-pow2-2/trace.ts';
test('mulPow2 正确', () => {
  assert.equal(mulPow2(3, 4), 48);
  assert.equal(mulPow2(1, 8), 256);
  assert.equal(mulPow2(-1, 2), -4);
  assert.equal(mulPow2(5, 0), 5);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
