import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeficient } from '../../src/algorithms/misc/misc-deficient-number/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-deficient-number/trace.ts';
test('素数是亏数', () => {
  assert.equal(isDeficient(13), true);
});
test('12 不是亏数', () => {
  assert.equal(isDeficient(12), false);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
