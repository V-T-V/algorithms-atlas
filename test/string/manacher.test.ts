import { test } from 'node:test';
import assert from 'node:assert/strict';
import { longestPalindrome, manacher } from '../../src/algorithms/string/manacher/impl.ts';

test('manacher 基本行为', () => {
  assert.deepEqual(manacher(''), []);
  assert.deepEqual(manacher('a'), [0, 1, 0]);
  assert.deepEqual(longestPalindrome('bb'), { start: 0, length: 2 });
});

test('manacher 返回最长回文子串位置', () => {
  const first = longestPalindrome('babad');
  assert.equal('babad'.slice(first.start, first.start + first.length), 'bab');
  assert.deepEqual(longestPalindrome('cbbd'), { start: 1, length: 2 });
});
