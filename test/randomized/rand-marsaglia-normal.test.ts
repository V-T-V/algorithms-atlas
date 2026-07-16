import { test } from 'node:test';
import assert from 'node:assert/strict';
import { marsagliaNormals } from '../../src/algorithms/randomized/rand-marsaglia-normal/impl.ts';
test('数量正确', () => {
  assert.equal(marsagliaNormals(3, 100).length, 100);
});
test('均值近 0', () => {
  const xs = marsagliaNormals(1, 5000);
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  assert.ok(Math.abs(mean) < 0.15);
});
