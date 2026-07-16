import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exponentialSamples } from '../../src/algorithms/randomized/rand-exp-sample/impl.ts';
test('均值为 1/λ', () => {
  const xs = exponentialSamples(1, 2, 5000);
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  assert.ok(Math.abs(mean - 0.5) < 0.05);
});
