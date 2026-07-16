import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isKaprekar } from '../../src/algorithms/misc/misc-kaprekar/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-kaprekar/trace.ts';
test('45 是卡布列克数', () => {
  assert.equal(isKaprekar(45), true);
});
test('100 不是', () => {
  assert.equal(isKaprekar(100), false);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
