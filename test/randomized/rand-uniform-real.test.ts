import { test } from 'node:test';
import assert from 'node:assert/strict';
import { uniformReals } from '../../src/algorithms/randomized/rand-uniform-real/impl.ts';
test('值在范围内', () => {
  const xs = uniformReals(1, 2.5, 7.5, 300);
  assert.ok(xs.every((x) => x >= 2.5 && x < 7.5));
});
