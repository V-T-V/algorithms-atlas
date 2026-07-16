import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boxMullerNormals } from '../../src/algorithms/randomized/rand-box-muller/impl.ts';
test('均值近似', () => {
  const xs = boxMullerNormals(1, 5000, 5, 2);
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  assert.ok(Math.abs(mean - 5) < 0.2);
});
