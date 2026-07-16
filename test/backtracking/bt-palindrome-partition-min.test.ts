import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  btPalindromePartitionMin,
  btPalindromePartitionMinList,
} from '../../src/algorithms/backtracking/bt-palindrome-partition-min/impl.ts';

test('bt-palindrome-partition-min 已是回文则 0 切割', () => {
  assert.equal(btPalindromePartitionMin('racecar'), 0);
  assert.equal(btPalindromePartitionMin('a'), 0);
});

test('bt-palindrome-partition-min aab 需 1 切', () => {
  assert.equal(btPalindromePartitionMin('aab'), 1);
});

test('bt-palindrome-partition-min 每块都是回文', () => {
  const parts = btPalindromePartitionMinList('aab');
  for (const p of parts) {
    const r = [...p].reverse().join('');
    assert.equal(p, r);
  }
  assert.equal(parts.join(''), 'aab');
});

test('bt-palindrome-partition-min 切割数 = 块数 - 1', () => {
  const s = 'aabbc';
  const cuts = btPalindromePartitionMin(s);
  const parts = btPalindromePartitionMinList(s);
  assert.equal(cuts, parts.length - 1);
});
