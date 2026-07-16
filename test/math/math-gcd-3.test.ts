import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binaryGcd } from '../../src/algorithms/math/math-gcd-3/impl.ts';

test('stein 基本例', () => {
  assert.equal(binaryGcd(84, 60), 12n);
  assert.equal(binaryGcd(48, 18), 6n);
});

test('stein 含 0', () => {
  assert.equal(binaryGcd(0, 7), 7n);
  assert.equal(binaryGcd(7, 0), 7n);
});

test('stein 大数', () => {
  assert.equal(binaryGcd(123456789n, 987654321n), 9n);
});
