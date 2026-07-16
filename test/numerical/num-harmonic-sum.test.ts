import { test } from 'node:test';
import assert from 'node:assert/strict';
import { harmonicSum } from '../../src/algorithms/numerical/num-harmonic-sum/impl.ts';
test('H₁=1', () => {
  assert.equal(harmonicSum(1), 1);
});
test('H₁₀≈2.93', () => {
  assert.ok(Math.abs(harmonicSum(10) - 2.9289) < 1e-3);
});
