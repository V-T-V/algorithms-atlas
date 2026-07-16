import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btPalindromePartitionAll } from '../../src/algorithms/backtracking/bt-palindrome-partition-all/impl.ts';

test('bt-palindrome-partition-all aab', () => {
  const r = btPalindromePartitionAll('aab')
    .map((p) => p.join('|'))
    .sort();
  assert.deepEqual(r, ['a|a|b', 'aa|b']);
});

test('bt-palindrome-partition-all racecar', () => {
  const r = btPalindromePartitionAll('racecar');
  // 整串本身回文一定在内
  assert.ok(r.some((p) => p.length === 1 && p[0]! === 'racecar'));
});

test('bt-palindrome-partition-all 每段都是回文', () => {
  const r = btPalindromePartitionAll('aabbc');
  for (const parts of r) {
    for (const seg of parts) {
      assert.equal(seg, [...seg].reverse().join(''));
    }
    assert.equal(parts.join(''), 'aabbc');
  }
});

test('bt-palindrome-partition-all 空串 1 个空方案', () => {
  assert.deepEqual(btPalindromePartitionAll(''), [[]]);
});
