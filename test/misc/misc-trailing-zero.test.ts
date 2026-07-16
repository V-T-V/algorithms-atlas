import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscTrailingZero } from '../../src/algorithms/misc/misc-trailing-zero/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-trailing-zero/trace.ts';
test('trailingZero 3=0', () => {
  assert.equal(miscTrailingZero(3), 0);
});
test('trailingZero 5=1', () => {
  assert.equal(miscTrailingZero(5), 1);
});
test('trailingZero 25=6', () => {
  assert.equal(miscTrailingZero(25), 6);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
