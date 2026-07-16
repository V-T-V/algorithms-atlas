import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modPow2 } from '../../src/algorithms/bitwise/bit-mod-pow2-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-mod-pow2-2/trace.ts';
test('modPow2 正确', () => {
  assert.equal(modPow2(25, 8), 1);
  assert.equal(modPow2(17, 16), 1);
  assert.equal(modPow2(255, 64), 63);
  assert.equal(modPow2(7, 4), 3);
  assert.equal(modPow2(8, 8), 0);
});
test('modPow2 非幂报错', () => {
  assert.throws(() => modPow2(10, 6), RangeError);
  assert.throws(() => modPow2(10, 0), RangeError);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
