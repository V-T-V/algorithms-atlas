import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xoroshiroSeq } from '../../src/algorithms/randomized/rand-xoroshiro128/impl.ts';
test('范围合法', () => {
  const xs = xoroshiroSeq(1, 100);
  assert.ok(xs.every((x) => x >= 0 && x < 1));
});
test('可复现', () => {
  assert.deepEqual(xoroshiroSeq(5, 5), xoroshiroSeq(5, 5));
});
