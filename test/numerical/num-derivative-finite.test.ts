import { test } from 'node:test';
import assert from 'node:assert/strict';
import { derivative } from '../../src/algorithms/numerical/num-derivative-finite/impl.ts';
test('d/dx x² 在 3 处=6', () => {
  assert.ok(Math.abs(derivative((x) => x * x, 3) - 6) < 1e-4);
});
