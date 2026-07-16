import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jitter } from '../../src/algorithms/randomized/rand-jitter/impl.ts';
test('长度不变', () => {
  const a = jitter([1, 2, 3, 4], 0.1, 42);
  assert.equal(a.length, 4);
});
test('抖动范围', () => {
  const orig = [10, 10, 10, 10, 10];
  const j = jitter(orig, 0.5, 7);
  assert.ok(j.every((v, i) => Math.abs(v - orig[i]!) <= 0.5 + 1e-9));
});
