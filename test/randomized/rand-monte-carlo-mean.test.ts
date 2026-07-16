import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monteCarloMean } from '../../src/algorithms/randomized/rand-monte-carlo-mean/impl.ts';
test('E[x²] 在 [0,1] 上为 1/3', () => {
  const m = monteCarloMean((x) => x * x, 0, 1, 5000, 1);
  assert.ok(Math.abs(m - 1 / 3) < 0.02);
});
