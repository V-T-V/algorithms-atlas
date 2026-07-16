import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fermatIsPrime } from '../../src/algorithms/randomized/rand-fermat-test/impl.ts';
test('17 是素数', () => {
  assert.equal(fermatIsPrime(17, [2, 3, 5]), true);
});
test('15 不是', () => {
  assert.equal(fermatIsPrime(15, [2, 3, 5]), false);
});
