import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscPowerOf3 } from '../../src/algorithms/misc/misc-power-of-3/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-power-of-3/trace.ts';
test('27 是 3 的幂', () => {
  assert.equal(miscPowerOf3(27), true);
});
test('9 是 3 的幂', () => {
  assert.equal(miscPowerOf3(9), true);
});
test('45 不是 3 的幂', () => {
  assert.equal(miscPowerOf3(45), false);
});
test('1 是 3 的幂', () => {
  assert.equal(miscPowerOf3(1), true);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
