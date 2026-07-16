import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPalindromeRecursive } from '../../src/algorithms/recursion/is-palindrome-recursive/impl.ts';

test('isPalindromeRecursive 回文样例', () => {
  assert.equal(isPalindromeRecursive('racecar'), true);
  assert.equal(isPalindromeRecursive('level'), true);
  assert.equal(isPalindromeRecursive('noon'), true);
  assert.equal(isPalindromeRecursive('a'), true);
  assert.equal(isPalindromeRecursive(''), true);
});

test('isPalindromeRecursive 非回文', () => {
  assert.equal(isPalindromeRecursive('hello'), false);
  assert.equal(isPalindromeRecursive('abc'), false);
  assert.equal(isPalindromeRecursive('ab'), false);
});

test('isPalindromeRecursive 规范化模式', () => {
  assert.equal(isPalindromeRecursive('A man a plan a canal Panama', {}, { normalize: true }), true);
  assert.equal(isPalindromeRecursive('RaceCar', {}, { normalize: true }), true);
  assert.equal(isPalindromeRecursive('racecar', {}, { normalize: false }), true);
  assert.equal(isPalindromeRecursive('RaceCar', {}, { normalize: false }), false);
});

test('isPalindromeRecursive 偶数长度', () => {
  assert.equal(isPalindromeRecursive('abba'), true);
  assert.equal(isPalindromeRecursive('abca'), false);
});
