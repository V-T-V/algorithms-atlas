import { test } from 'node:test';
import assert from 'node:assert/strict';
import { expTaylor } from '../../src/algorithms/numerical/num-exp-taylor/impl.ts';
test('e^1', () => {
  assert.ok(Math.abs(expTaylor(1) - Math.E) < 1e-6);
});
test('e^0=1', () => {
  assert.ok(Math.abs(expTaylor(0) - 1) < 1e-9);
});
