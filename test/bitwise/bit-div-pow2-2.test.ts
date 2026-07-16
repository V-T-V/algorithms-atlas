import { test } from 'node:test';
import assert from 'node:assert/strict';
import { divPow2 } from '../../src/algorithms/bitwise/bit-div-pow2-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-div-pow2-2/trace.ts';
test('divPow2 正数正确', () => {
  assert.equal(divPow2(100, 3), 12);
  assert.equal(divPow2(7, 1), 3);
  assert.equal(divPow2(8, 0), 8);
});
test('divPow2 负数向零取整', () => {
  assert.equal(divPow2(-100, 3), -12); // 向零而非向下
  assert.equal(divPow2(-8, 2), -2);
  assert.equal(divPow2(-7, 1), -3);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
