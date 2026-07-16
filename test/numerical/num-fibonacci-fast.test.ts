import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fibFast } from '../../src/algorithms/numerical/num-fibonacci-fast/impl.ts';
test('F(0)=0', () => {
  assert.equal(fibFast(0), 0);
});
test('F(1)=1', () => {
  assert.equal(fibFast(1), 1);
});
test('F(10)=55', () => {
  assert.equal(fibFast(10), 55);
});
test('F(20)=6765', () => {
  assert.equal(fibFast(20), 6765);
});
