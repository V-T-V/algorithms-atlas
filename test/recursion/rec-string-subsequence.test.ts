import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  distinctSubsequences,
  distinctSubsequencesRec,
} from '../../src/algorithms/recursion/rec-string-subsequence/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-string-subsequence/trace.ts';

test('rec-string-subsequence 无重复字符', () => {
  // "abc": {}, a,b,c,ab,ac,bc,abc = 7
  assert.equal(distinctSubsequences('abc'), 7);
});

test('rec-string-subsequence 含重复', () => {
  // "aaa": a, aa, aaa = 3
  assert.equal(distinctSubsequences('aaa'), 3);
  // "aba": a,b,aa,ab,ba,aba = 6
  assert.equal(distinctSubsequences('aba'), 6);
});

test('rec-string-subsequence 递归版一致', () => {
  for (const s of ['abc', 'aaa', 'aba', 'abab']) {
    assert.equal(distinctSubsequences(s) + 1, distinctSubsequencesRec(s) % 1000000007);
  }
});

test('rec-string-subsequence trace', () => {
  assert.ok(buildTrace().length > 2);
});
