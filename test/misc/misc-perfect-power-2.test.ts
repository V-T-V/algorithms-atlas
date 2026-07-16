import { test } from 'node:test';
import assert from 'node:assert/strict';
import { perfectPower } from '../../src/algorithms/misc/misc-perfect-power-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-perfect-power-2/trace.ts';
test('64 = 8^2 或 2^6', () => {
  const r = perfectPower(64);
  assert.equal(r.isPerfect, true);
  assert.equal(Math.pow(r.base, r.exp), 64);
});
test('素数非完美幂', () => {
  assert.equal(perfectPower(17).isPerfect, false);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
