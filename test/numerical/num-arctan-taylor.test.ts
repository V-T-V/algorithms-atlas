import { test } from 'node:test';
import assert from 'node:assert/strict';
import { atanTaylor } from '../../src/algorithms/numerical/num-arctan-taylor/impl.ts';
test('atan(1)=π/4', () => {
  assert.ok(Math.abs(atanTaylor(1) - Math.PI / 4) < 1e-2);
});
test('atan(0)=0', () => {
  assert.ok(Math.abs(atanTaylor(0)) < 1e-9);
});
