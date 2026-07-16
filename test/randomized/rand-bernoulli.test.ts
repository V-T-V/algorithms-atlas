import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bernoulliSamples } from '../../src/algorithms/randomized/rand-bernoulli/impl.ts';
test('值为 0 或 1', () => {
  const xs = bernoulliSamples(1, 0.3, 200);
  assert.ok(xs.every((x) => x === 0 || x === 1));
});
test('p=1 全为 1', () => {
  const xs = bernoulliSamples(2, 1.0, 50);
  assert.ok(xs.every((x) => x === 1));
});
