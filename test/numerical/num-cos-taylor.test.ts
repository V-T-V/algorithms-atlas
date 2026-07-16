import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cosTaylor } from '../../src/algorithms/numerical/num-cos-taylor/impl.ts';
test('cos(0)=1', () => {
  assert.ok(Math.abs(cosTaylor(0) - 1) < 1e-9);
});
test('cos(π)=-1', () => {
  assert.ok(Math.abs(cosTaylor(Math.PI) - -1) < 1e-9);
});
