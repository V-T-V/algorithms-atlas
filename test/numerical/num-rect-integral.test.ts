import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rectangleIntegral } from '../../src/algorithms/numerical/num-rect-integral/impl.ts';
test('∫0^1 x² dx ≈ 1/3', () => {
  assert.ok(Math.abs(rectangleIntegral((x) => x * x, 0, 1, 10000) - 1 / 3) < 1e-3);
});
