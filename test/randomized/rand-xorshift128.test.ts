import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xorshift128Seq } from '../../src/algorithms/randomized/rand-xorshift128/impl.ts';
test('范围合法', () => {
  const xs = xorshift128Seq(99, 200);
  assert.ok(xs.every((x) => x >= 0 && x < 1));
});
test('可复现', () => {
  assert.deepEqual(xorshift128Seq(5, 10), xorshift128Seq(5, 10));
});
