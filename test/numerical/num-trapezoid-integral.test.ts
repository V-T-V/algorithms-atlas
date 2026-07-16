import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trapezoidIntegral } from '../../src/algorithms/numerical/num-trapezoid-integral/impl.ts';
test('∫0^1 x² dx ≈ 1/3', () => {
  assert.ok(Math.abs(trapezoidIntegral((x) => x * x, 0, 1, 1000) - 1 / 3) < 1e-5);
});
