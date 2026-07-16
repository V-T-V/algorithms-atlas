import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countPalindromicSubseq } from '../../src/algorithms/dp/dp-count-palindromic-subseq/impl.ts';

test('count-palin-subseq 单字符', () => {
  assert.equal(countPalindromicSubseq('a'), 1);
});

test('count-palin-subseq 两字符相同', () => {
  // "aa": 子序列 a,a,aa => 3
  assert.equal(countPalindromicSubseq('aa'), 3);
});

test('count-palin-subseq 两字符不同', () => {
  // "ab": a,b => 2
  assert.equal(countPalindromicSubseq('ab'), 2);
});

test('count-palin-subseq aba', () => {
  // a,b,a,aa,aba => 5
  assert.equal(countPalindromicSubseq('aba'), 5);
});

test('count-palin-subseq 空串', () => {
  assert.equal(countPalindromicSubseq(''), 0);
});
