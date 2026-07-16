import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bernoulliTable } from '../../src/algorithms/math/math-bern-3/impl.ts';

test('bernoulli 前几项', () => {
  // B0=1, B1=-1/2, B2=1/6, B3=0, B4=-1/30, B5=0, B6=1/42
  const B = bernoulliTable(6);
  assert.deepEqual(B[0], { num: 1n, den: 1n });
  assert.deepEqual(B[1], { num: -1n, den: 2n });
  assert.deepEqual(B[2], { num: 1n, den: 6n });
  assert.deepEqual(B[3], { num: 0n, den: 1n });
  assert.deepEqual(B[4], { num: -1n, den: 30n });
  assert.deepEqual(B[6], { num: 1n, den: 42n });
});
