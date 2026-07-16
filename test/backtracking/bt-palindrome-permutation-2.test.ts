import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btPalindromePermutation2 } from '../../src/algorithms/backtracking/bt-palindrome-permutation-2/impl.ts';

const isPal = (s: string): boolean => s === [...s].reverse().join('');

test('bt-palindrome-permutation-2 aabb', () => {
  const res = btPalindromePermutation2('aabb');
  assert.deepEqual([...res].sort(), ['abba', 'baab']);
});

test('bt-palindrome-permutation-2 所有结果都是回文', () => {
  const res = btPalindromePermutation2('aabbcc');
  for (const s of res) assert.ok(isPal(s));
});

test('bt-palindrome-permutation-2 无可行解', () => {
  assert.deepEqual(btPalindromePermutation2('abc'), []);
});

test('bt-palindrome-permutation-2 结果无重复', () => {
  const res = btPalindromePermutation2('aaaabb');
  const set = new Set(res);
  assert.equal(res.length, set.size);
});
