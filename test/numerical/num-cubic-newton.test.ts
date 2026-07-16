import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cubeRootNewton } from '../../src/algorithms/numerical/num-cubic-newton/impl.ts';
test('∛27=3', () => {
  assert.ok(Math.abs(cubeRootNewton(27) - 3) < 1e-8);
});
test('∛-8=-2', () => {
  assert.ok(Math.abs(cubeRootNewton(-8) - -2) < 1e-8);
});
test('∛0=0', () => {
  assert.equal(cubeRootNewton(0), 0);
});
