import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  Xorshift32,
  xorshift32Sequence,
} from '../../src/algorithms/randomized/rand-xorshift32/impl.ts';
test('范围 [0,1)', () => {
  const xs = xorshift32Sequence(123, 100);
  assert.ok(xs.every((x) => x >= 0 && x < 1));
});
test('可复现', () => {
  assert.deepEqual(xorshift32Sequence(7, 5), xorshift32Sequence(7, 5));
});
test('不同种子不同', () => {
  assert.notDeepEqual(xorshift32Sequence(1, 5), xorshift32Sequence(2, 5));
});
