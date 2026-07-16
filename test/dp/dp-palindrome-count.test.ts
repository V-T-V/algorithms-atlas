import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countPalindromeSubstrings } from '../../src/algorithms/dp/dp-palindrome-count/impl.ts';

test('palindrome-count LeetCode 647 例', () => {
  assert.equal(countPalindromeSubstrings('abc'), 3); // a,b,c
  assert.equal(countPalindromeSubstrings('aaa'), 6); // a,a,a,aa,aa,aaa
});

test('palindrome-count 单字符', () => {
  assert.equal(countPalindromeSubstrings('a'), 1);
});

test('palindrome-count 空串', () => {
  assert.equal(countPalindromeSubstrings(''), 0);
});

test('palindrome-count 全相同', () => {
  assert.equal(countPalindromeSubstrings('aaaa'), 10); // 4+3+2+1
});

test('palindrome-count 长回文', () => {
  assert.equal(countPalindromeSubstrings('abba'), 6); // a,b,b,a,bb,abba
});

test('palindrome-count 钩子', () => {
  let checks = 0;
  countPalindromeSubstrings('abc', { onCheck: () => checks++ });
  assert.equal(checks, 3 + 2 + 1); // 所有 (i<=j) 对
});
