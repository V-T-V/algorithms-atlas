import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countPalindromes } from '../../src/algorithms/string/str-palindromic-3/impl.ts';

test('palindromic aaa', () => {
  // a,a,a,aa,aa,aaa = 6
  assert.equal(countPalindromes('aaa').total, 6);
});

test('palindromic abc', () => {
  // a,b,c = 3
  assert.equal(countPalindromes('abc').total, 3);
});

test('palindromic abba', () => {
  // a,b,b,a,bb,abba = 6
  assert.equal(countPalindromes('abba').total, 6);
});
