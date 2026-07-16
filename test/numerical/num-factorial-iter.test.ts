import { test } from 'node:test';
import assert from 'node:assert/strict';
import { factorial } from '../../src/algorithms/numerical/num-factorial-iter/impl.ts';
test('5!=120', () => {
  assert.equal(factorial(5), 120);
});
test('0!=1', () => {
  assert.equal(factorial(0), 1);
});
test('负数报错', () => {
  assert.throws(() => factorial(-1), RangeError);
});
