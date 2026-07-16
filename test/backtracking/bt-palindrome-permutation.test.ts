import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btPalindromePermutation } from '../../src/algorithms/backtracking/bt-palindrome-permutation/impl.ts';

test('bt-palindrome-permutation 可重排', () => {
  assert.equal(btPalindromePermutation('code'), false);
  assert.equal(btPalindromePermutation('aab'), true);
  assert.equal(btPalindromePermutation('carerac'), true);
});

test('bt-palindrome-permutation 空串', () => {
  assert.equal(btPalindromePermutation(''), true);
});

test('bt-palindrome-permutation 单字符', () => {
  assert.equal(btPalindromePermutation('a'), true);
});
