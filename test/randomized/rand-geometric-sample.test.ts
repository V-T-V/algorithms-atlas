import { test } from 'node:test';
import assert from 'node:assert/strict';
import { geometricSamples } from '../../src/algorithms/randomized/rand-geometric-sample/impl.ts';
test('均值为 (1-p)/p', () => {
  const xs = geometricSamples(1, 0.5, 3000);
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  assert.ok(Math.abs(mean - 1) < 0.2);
});
test('非负', () => {
  const xs = geometricSamples(2, 0.3, 100);
  assert.ok(xs.every((x) => x >= 0));
});
