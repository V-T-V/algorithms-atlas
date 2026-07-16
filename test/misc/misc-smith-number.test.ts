import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isSmithNumber } from '../../src/algorithms/misc/misc-smith-number/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-smith-number/trace.ts';
test('666 是史密斯数', () => {
  assert.equal(isSmithNumber(666), true);
});
test('素数非史密斯', () => {
  assert.equal(isSmithNumber(7), false);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
