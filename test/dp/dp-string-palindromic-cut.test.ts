import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minCutPalindrome } from '../../src/algorithms/dp/dp-string-palindromic-cut/impl.ts';

test('palindromic-cut LeetCode 132 例 1', () => {
  assert.equal(minCutPalindrome('aab'), 1);
});

test('palindromic-cut LeetCode 132 例 2', () => {
  assert.equal(minCutPalindrome('a'), 0);
});

test('palindromic-cut LeetCode 132 例 3', () => {
  assert.equal(minCutPalindrome('ab'), 1);
});

test('palindromic-cut 整串回文', () => {
  assert.equal(minCutPalindrome('racecar'), 0);
});

test('palindromic-cut 无重复字符', () => {
  assert.equal(minCutPalindrome('abcdef'), 5);
});

test('palindromic-cut 空', () => {
  assert.equal(minCutPalindrome(''), 0);
});
