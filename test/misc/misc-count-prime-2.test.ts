import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscCountPrime2 } from '../../src/algorithms/misc/misc-count-prime-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-count-prime-2/trace.ts';
test('countPrime 10 = 4', () => {
  assert.equal(miscCountPrime2(10), 4);
});
test('countPrime 0 = 0', () => {
  assert.equal(miscCountPrime2(0), 0);
});
test('countPrime 1 = 0', () => {
  assert.equal(miscCountPrime2(1), 0);
});
test('countPrime 100 = 25', () => {
  assert.equal(miscCountPrime2(100), 25);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
