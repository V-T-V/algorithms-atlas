import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isNarcissistic } from '../../src/algorithms/misc/misc-narcissistic-number/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-narcissistic-number/trace.ts';
test('153 是水仙花数', () => {
  assert.equal(isNarcissistic(153), true);
});
test('100 不是', () => {
  assert.equal(isNarcissistic(100), false);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
