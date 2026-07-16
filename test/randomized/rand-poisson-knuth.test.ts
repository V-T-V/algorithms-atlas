import { test } from 'node:test';
import assert from 'node:assert/strict';
import { poissonKnuth } from '../../src/algorithms/randomized/rand-poisson-knuth/impl.ts';
test('均值为 λ', () => {
  const xs = poissonKnuth(1, 5, 3000);
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  assert.ok(Math.abs(mean - 5) < 0.3);
});
test('非负', () => {
  const xs = poissonKnuth(2, 3, 100);
  assert.ok(xs.every((x) => x >= 0));
});
