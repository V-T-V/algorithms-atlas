import { test } from 'node:test';
import assert from 'node:assert/strict';
import { absMask } from '../../src/algorithms/bitwise/bit-abs-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-abs-2/trace.ts';
test('absMask 正确', () => {
  assert.equal(absMask(0), 0);
  assert.equal(absMask(5), 5);
  assert.equal(absMask(-7), 7);
  assert.equal(absMask(-1), 1);
  assert.equal(absMask(-256), 256);
  assert.equal(absMask(2147483647), 2147483647);
});
test('absMask 钩子触发', () => {
  let c = 0;
  absMask(-100, { onMask: () => c++, onResult: () => c++ });
  assert.equal(c, 2);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
