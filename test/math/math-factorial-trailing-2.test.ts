import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trailingZeros } from '../../src/algorithms/math/math-factorial-trailing-2/impl.ts';

test('trailing-zeros 5! = 1', () => {
  assert.equal(trailingZeros(5), 1);
});

test('trailing-zeros 25! = 6', () => {
  assert.equal(trailingZeros(25), 6); // 5+1
});

test('trailing-zeros 100! = 24', () => {
  assert.equal(trailingZeros(100), 24);
});

test('trailing-zeros 0! = 0', () => {
  assert.equal(trailingZeros(0), 0);
});

test('trailing-zeros 4! = 0', () => {
  assert.equal(trailingZeros(4), 0);
});

test('trailing-zeros 1000! = 249', () => {
  assert.equal(trailingZeros(1000), 249);
});
