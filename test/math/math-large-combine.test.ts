import { test } from 'node:test';
import assert from 'node:assert/strict';
import { largeCombine } from '../../src/algorithms/math/math-large-combine/impl.ts';

test('C(5,2) = 10', () => {
  assert.equal(largeCombine(5, 2), 10n);
});

test('C(10,4) = 210', () => {
  assert.equal(largeCombine(10, 4), 210n);
});

test('C(n,0) = 1', () => {
  assert.equal(largeCombine(7, 0), 1n);
});

test('C(n,n) = 1', () => {
  assert.equal(largeCombine(7, 7), 1n);
});

test('C(100,50) 大数无溢出', () => {
  const v = largeCombine(100, 50);
  assert.equal(v.toString(), '100891344545564193334812497256');
});

test('C(5,6) 越界 = 0', () => {
  assert.equal(largeCombine(5, 6), 0n);
});
