import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitmixSeq } from '../../src/algorithms/randomized/rand-splitmix64/impl.ts';
test('范围合法', () => {
  const xs = splitmixSeq(7, 100);
  assert.ok(xs.every((x) => x >= 0 && x < 1));
});
