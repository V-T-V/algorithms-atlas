import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parkMillerSeq } from '../../src/algorithms/randomized/rand-park-miller/impl.ts';
test('范围合法', () => {
  const xs = parkMillerSeq(1, 100);
  assert.ok(xs.every((x) => x >= 0 && x < 1));
});
test('可复现', () => {
  assert.deepEqual(parkMillerSeq(1, 5), parkMillerSeq(1, 5));
});
