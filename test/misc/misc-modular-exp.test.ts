import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modPow } from '../../src/algorithms/misc/misc-modular-exp/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-modular-exp/trace.ts';
test('2^10 mod 1000 = 24', () => {
  assert.equal(modPow(2, 10, 1000), 24);
});
test('大指数正确', () => {
  assert.equal(modPow(3, 100, 7), 4);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
