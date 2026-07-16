import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, isPalindrome2 } from '../../src/algorithms/list/list-is-palindrome-2/impl.ts';

test('isPalindrome2 判定', () => {
  assert.equal(isPalindrome2(buildList([1, 2, 2, 1])), true);
  assert.equal(isPalindrome2(buildList([1, 2, 3, 2, 1])), true);
  assert.equal(isPalindrome2(buildList([1, 2])), false);
  assert.equal(isPalindrome2(buildList([1])), true);
  assert.equal(isPalindrome2(buildList([1, 2, 3])), false);
});

test('isPalindrome2 钩子', () => {
  let compares = 0;
  isPalindrome2(buildList([1, 2, 2, 1]), { onCompare: () => compares++ });
  assert.equal(compares, 2);
});
