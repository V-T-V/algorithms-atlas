import { test } from 'node:test';
import assert from 'node:assert/strict';
import { uniformInts } from '../../src/algorithms/randomized/rand-uniform-int/impl.ts';
test('值在范围内', () => {
  const xs = uniformInts(3, 10, 20, 300);
  assert.ok(xs.every((x) => x >= 10 && x <= 20));
});
