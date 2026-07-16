import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gammaSamples } from '../../src/algorithms/randomized/rand-gamma-marsaglia/impl.ts';
test('均值为 shape·scale', () => {
  const xs = gammaSamples(1, 3, 2, 5000);
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  assert.ok(Math.abs(mean - 6) < 0.5);
});
test('非负', () => {
  const xs = gammaSamples(2, 2, 1, 200);
  assert.ok(xs.every((x) => x >= 0));
});
