import { test } from 'node:test';
import assert from 'node:assert/strict';
import { robbinsMonro } from '../../src/algorithms/randomized/rand-stochastic-approx/impl.ts';
test('收敛到根', () => {
  const root = robbinsMonro((x) => x - 2, 0, 5000, 1);
  assert.ok(Math.abs(root - 2) < 0.1);
});
