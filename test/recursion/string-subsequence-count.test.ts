import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countSubsequence } from '../../src/algorithms/recursion/string-subsequence-count/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/string-subsequence-count/trace.ts';

test('countSubsequence LeetCode 115 经典', () => {
  // s="rabbbit", t="rabbit" → 3
  assert.equal(countSubsequence('rabbbit', 'rabbit'), 3);
});

test('countSubsequence t 等于 s', () => {
  assert.equal(countSubsequence('abc', 'abc'), 1);
});

test('countSubsequence t 含 s 没有的字符', () => {
  assert.equal(countSubsequence('abc', 'xyz'), 0);
});

test('countSubsequence 空 t', () => {
  assert.equal(countSubsequence('abc', ''), 1);
});

test('countSubsequence 空 s 空 t', () => {
  assert.equal(countSubsequence('', ''), 1);
});

test('countSubsequence 空 s 非空 t', () => {
  assert.equal(countSubsequence('', 'a'), 0);
});

test('countSubsequence 全相同字符', () => {
  // s="aaa", t="aa" → C(3,2) = 3
  assert.equal(countSubsequence('aaa', 'aa'), 3);
});

test('countSubsequence 钩子触发', () => {
  let computes = 0;
  countSubsequence('abab', 'ab', { onCompute: () => computes++ });
  assert.ok(computes >= 1);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
