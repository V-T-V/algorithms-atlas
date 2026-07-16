import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extGcdIter } from '../../src/algorithms/math/math-ext-gcd-3/impl.ts';

test('ext-gcd 基本例', () => {
  const r = extGcdIter(240, 46);
  assert.equal(r.g, 2n);
  // 240*x + 46*y = 2
  assert.equal(240n * r.x + 46n * r.y, 2n);
});

test('ext-gcd 互素', () => {
  const r = extGcdIter(35n, 12n);
  assert.equal(r.g, 1n);
  assert.equal(35n * r.x + 12n * r.y, 1n);
});

test('ext-gcd 含 0', () => {
  const r = extGcdIter(7, 0);
  assert.equal(r.g, 7n);
});
