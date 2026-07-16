import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sinTaylor } from '../../src/algorithms/numerical/num-sin-taylor/impl.ts';
test('sin(π/2)=1', () => {
  assert.ok(Math.abs(sinTaylor(Math.PI / 2) - 1) < 1e-9);
});
test('sin(0)=0', () => {
  assert.ok(Math.abs(sinTaylor(0)) < 1e-9);
});
