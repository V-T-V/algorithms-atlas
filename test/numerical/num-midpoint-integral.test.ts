import { test } from 'node:test';
import assert from 'node:assert/strict';
import { midpointIntegral } from '../../src/algorithms/numerical/num-midpoint-integral/impl.ts';
test('∫0^1 x² dx ≈ 1/3', () => {
  assert.ok(Math.abs(midpointIntegral((x) => x * x, 0, 1, 100) - 1 / 3) < 1e-5);
});
