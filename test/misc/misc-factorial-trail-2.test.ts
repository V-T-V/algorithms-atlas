import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscFactorialTrail2 } from '../../src/algorithms/misc/misc-factorial-trail-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-factorial-trail-2/trace.ts';
test('10! 末尾 2 个 0', () => {
  assert.equal(miscFactorialTrail2(10), 2);
});
test('25! 末尾 6 个 0', () => {
  assert.equal(miscFactorialTrail2(25), 6);
});
test('0! 末尾 0', () => {
  assert.equal(miscFactorialTrail2(0), 0);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
