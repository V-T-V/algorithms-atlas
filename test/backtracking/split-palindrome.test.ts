import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  splitPalindrome,
  splitPalindromePlan,
  type SplitPalindromeHooks,
} from '../../src/algorithms/backtracking/split-palindrome/impl.ts';

test('split-palindrome "aab" = 1', () => {
  assert.equal(splitPalindrome('aab'), 1);
});

test('split-palindrome "a" = 0', () => {
  assert.equal(splitPalindrome('a'), 0);
});

test('split-palindrome "ab" = 1', () => {
  assert.equal(splitPalindrome('ab'), 1);
});

test('split-palindrome "ababbbabbababa"', () => {
  // 暴力验证最小分割为 3：["a","bab","bbabb","ababa"]
  assert.equal(splitPalindrome('ababbbabbababa'), 3);
});

test('split-palindrome 空串 = 0', () => {
  assert.equal(splitPalindrome(''), 0);
});

test('split-palindrome 整串回文 = 0', () => {
  assert.equal(splitPalindrome('aaa'), 0);
  assert.equal(splitPalindrome('racecar'), 0);
});

test('split-palindrome 全不同 = n-1', () => {
  assert.equal(splitPalindrome('abcdef'), 5);
});

test('split-palindrome plan 各段均为回文', () => {
  const s = 'aab';
  const plan = splitPalindromePlan(s);
  assert.equal(plan.join(''), s);
  for (const seg of plan) {
    assert.equal(seg, [...seg].reverse().join(''), `${seg} 应为回文`);
  }
  assert.equal(plan.length - 1, splitPalindrome(s));
});

test('split-palindrome plan 段数 = cuts+1', () => {
  const cases = ['aab', 'ababbbabbababa', 'racecar', 'ab'];
  for (const s of cases) {
    const plan = splitPalindromePlan(s);
    assert.equal(plan.length - 1, splitPalindrome(s));
    assert.equal(plan.join(''), s);
  }
});

test('split-palindrome 钩子被调用', () => {
  let precompute = 0;
  let trycut = 0;
  const hooks: SplitPalindromeHooks = {
    onPrecompute: () => precompute++,
    onTryCut: () => trycut++,
  };
  splitPalindrome('aab', hooks);
  assert.equal(precompute, 1);
  assert.ok(trycut > 0);
});
