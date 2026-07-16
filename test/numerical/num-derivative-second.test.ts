import { test } from 'node:test';
import assert from 'node:assert/strict';
import { secondDerivative } from '../../src/algorithms/numerical/num-derivative-second/impl.ts';
test('d²/dx² x³ 在 2 处=12', () => {
  assert.ok(Math.abs(secondDerivative((x) => x ** 3, 2) - 12) < 1e-2);
});
