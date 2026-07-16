import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, isPalindrome } from '../../src/algorithms/list/list-palindrome-3/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-palindrome-3/trace.ts';
test('isPalindrome 正确', () => {
  assert.equal(isPalindrome(buildList([1, 2, 3, 2, 1])), true);
  assert.equal(isPalindrome(buildList([1, 2, 2, 1])), true);
  assert.equal(isPalindrome(buildList([1, 2, 3])), false);
  assert.equal(isPalindrome(buildList([1])), true);
  assert.equal(isPalindrome(null), true);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
