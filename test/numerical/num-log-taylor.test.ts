import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lnTaylor } from '../../src/algorithms/numerical/num-log-taylor/impl.ts';
test('ln(1.5) 近似', () => {
  assert.ok(Math.abs(lnTaylor(0.5) - Math.log(1.5)) < 1e-6);
});
test('ln(1)=0', () => {
  assert.ok(Math.abs(lnTaylor(0)) < 1e-9);
});
