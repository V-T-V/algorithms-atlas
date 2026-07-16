import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isKeithNumber } from '../../src/algorithms/misc/misc-keith-number/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-keith-number/trace.ts';
test('197 是基思数', () => {
  assert.equal(isKeithNumber(197), true);
});
test('100 不是基思数', () => {
  assert.equal(isKeithNumber(100), false);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
