import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bellNumber } from '../../src/algorithms/misc/misc-bell-number/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-bell-number/trace.ts';
test('B0..B5', () => {
  assert.equal(bellNumber(0), 1);
  assert.equal(bellNumber(3), 5);
  assert.equal(bellNumber(5), 52);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
