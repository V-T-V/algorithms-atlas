import { test } from 'node:test';
import assert from 'node:assert/strict';
import { millerRabin } from '../../src/algorithms/misc/misc-miller-rabin/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-miller-rabin/trace.ts';
test('561 是合数 (Carmichael)', () => {
  assert.equal(millerRabin(561, 20), false);
});
test('大素数判定', () => {
  assert.equal(millerRabin(1000003, 20), true);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
