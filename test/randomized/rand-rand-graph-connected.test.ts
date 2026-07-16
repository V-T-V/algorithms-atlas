import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reachableFraction } from '../../src/algorithms/randomized/rand-rand-graph-connected/impl.ts';
test('比例在 [0,1]', () => {
  const f = reachableFraction([[1, 2], [0], [0]], 0, 10, 5, 42);
  assert.ok(f >= 0 && f <= 1);
});
