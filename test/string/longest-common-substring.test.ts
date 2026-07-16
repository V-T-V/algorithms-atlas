import { test } from 'node:test';
import assert from 'node:assert/strict';
import { longestCommonSubstring } from '../../src/algorithms/string/longest-common-substring/impl.ts';

test('longestCommonSubstring 基本', () => {
  assert.equal(longestCommonSubstring('abcdef', 'zcdem').substring, 'cde');
  assert.equal(longestCommonSubstring('abcdef', 'zcdem').length, 3);
  assert.equal(longestCommonSubstring('ABABC', 'BABCA').substring, 'BABC');
});

test('longestCommonSubstring 无公共', () => {
  assert.equal(longestCommonSubstring('abc', 'xyz').length, 0);
  assert.equal(longestCommonSubstring('', 'abc').length, 0);
});

test('longestCommonSubstring 全相同', () => {
  assert.equal(longestCommonSubstring('aaaa', 'aa').substring, 'aa');
  assert.equal(longestCommonSubstring('aaaa', 'aa').length, 2);
});

test('longestCommonSubstring 多个等长取一个', () => {
  // 'abXc' 'abYc' → 'ab' 长度 2
  const r = longestCommonSubstring('abXc', 'abYc');
  assert.equal(r.length, 2);
});

test('longestCommonSubstring 钩子', () => {
  let cells = 0;
  longestCommonSubstring('abc', 'ab', { onCell: () => cells++ });
  assert.ok(cells > 0);
});
