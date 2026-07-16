import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binomialCoeff } from '../../src/algorithms/numerical/num-binomial-coeff/impl.ts';
test('C(10,3)=120', () => {
  assert.equal(binomialCoeff(10, 3), 120);
});
test('C(5,0)=1', () => {
  assert.equal(binomialCoeff(5, 0), 1);
});
test('C(5,5)=1', () => {
  assert.equal(binomialCoeff(5, 5), 1);
});
test('非法报错', () => {
  assert.throws(() => binomialCoeff(2, 5), RangeError);
});
