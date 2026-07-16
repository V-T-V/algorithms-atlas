import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscBulb2 } from '../../src/algorithms/misc/misc-bulb-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-bulb-2/trace.ts';
test('bulb 0 = 0', () => {
  assert.equal(miscBulb2(0), 0);
});
test('bulb 3 = 1', () => {
  assert.equal(miscBulb2(3), 1);
});
test('bulb 9 = 3', () => {
  assert.equal(miscBulb2(9), 3);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
