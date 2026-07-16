import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPerfectPower } from '../../src/algorithms/misc/misc-perfect-power/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/misc-perfect-power/trace.ts';

test('perfect-power 27 = 3^3', () => {
  const r = isPerfectPower(27);
  assert.equal(r.isPerfectPower, true);
  assert.equal(r.base, 3);
  assert.equal(r.exponent, 3);
});

test('perfect-power 216 = 6^3', () => {
  const r = isPerfectPower(216);
  assert.equal(r.isPerfectPower, true);
  assert.equal(r.base, 6);
  assert.equal(r.exponent, 3);
});

test('perfect-power 16 = 2^4', () => {
  const r = isPerfectPower(16);
  assert.equal(r.isPerfectPower, true);
  assert.equal(r.base, 2);
  assert.equal(r.exponent, 4);
});

test('perfect-power 非完全幂', () => {
  assert.equal(isPerfectPower(10).isPerfectPower, false);
  assert.equal(isPerfectPower(7).isPerfectPower, false);
});

test('perfect-power 小数返回否', () => {
  assert.equal(isPerfectPower(3).isPerfectPower, false);
  assert.equal(isPerfectPower(1).isPerfectPower, false);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
