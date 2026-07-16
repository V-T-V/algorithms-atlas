import { test } from 'node:test';
import assert from 'node:assert/strict';
import { largePower } from '../../src/algorithms/math/math-large-power/impl.ts';

test('2^10 = 1024', () => {
  assert.equal(largePower(2, 10), 1024n);
});

test('3^0 = 1', () => {
  assert.equal(largePower(3, 0), 1n);
});

test('5^3 = 125', () => {
  assert.equal(largePower(5, 3), 125n);
});

test('2^100 大数', () => {
  assert.equal(largePower(2, 100), 1267650600228229401496703205376n);
});

test('10^50 = 1 后跟 50 个 0', () => {
  const s = largePower(10, 50).toString();
  assert.equal(s, '1' + '0'.repeat(50));
});
