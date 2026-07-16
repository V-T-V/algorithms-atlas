import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countDifferentPalindromicSubsequences } from '../../src/algorithms/dp/dp-count-different-palindromic/impl.ts';

test('count-pal 单字符 = 1', () => {
  assert.equal(countDifferentPalindromicSubsequences('a').count, 1);
});

test('count-pal bccb = 6', () => {
  // LeetCode 730 例：{b, c, bb, cc, bcb, bccb} = 6
  assert.equal(countDifferentPalindindromicOrDef('bccb'), 6);
});

test('count-pal abcd = 4', () => {
  // 4 个不同单字符，无长度>=2 回文
  assert.equal(countDifferentPalindindromicOrDef('abcd'), 4);
});

test('count-pal aaa = 3', () => {
  // {a, aa, aaa} = 3
  assert.equal(countDifferentPalindindromicOrDef('aaa'), 3);
});

test('count-pal 空串 = 0', () => {
  assert.equal(countDifferentPalindromicSubsequences('').count, 0);
});

test('count-pal 钩子被调用', () => {
  let calls = 0;
  countDifferentPalindromicSubsequences('bccb', { onRange: () => calls++ });
  assert.ok(calls > 0);
});

// 辅助：调用并取 count
function countDifferentPalindindromicOrDef(s: string): number {
  return countDifferentPalindromicSubsequences(s).count;
}
