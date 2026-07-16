import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tanh } from '../../src/algorithms/ml/ml-tanh-activation/impl.ts';
test('tanh(0)=0', () => {
  assert.ok(Math.abs(tanh(0)) < 1e-9);
});
