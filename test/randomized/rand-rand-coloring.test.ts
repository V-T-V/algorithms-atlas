import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomColoring } from '../../src/algorithms/randomized/rand-rand-coloring/impl.ts';
test('三角形需 3 色', () => {
  const c = randomColoring(
    [
      [1, 2],
      [0, 2],
      [0, 1],
    ],
    42,
  );
  assert.notEqual(c[0], c[1]);
  assert.notEqual(c[0], c[2]);
  assert.notEqual(c[1], c[2]);
});
