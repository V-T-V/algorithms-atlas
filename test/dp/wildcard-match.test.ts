import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wildcardMatch } from '../../src/algorithms/dp/wildcard-match/impl.ts';

test('wildcard-match 基本行为', () => {
  assert.equal(wildcardMatch('', ''), true);
  assert.equal(wildcardMatch('', '*'), true);
  assert.equal(wildcardMatch('', '?'), false);
  assert.equal(wildcardMatch('a', ''), false);
});

test('wildcard-match 经典用例', () => {
  // LeetCode 44 示例
  assert.equal(wildcardMatch('aa', 'a'), false);
  assert.equal(wildcardMatch('aa', '*'), true);
  assert.equal(wildcardMatch('cb', '?a'), false);
  assert.equal(wildcardMatch('adceb', '*a*b'), true);
  assert.equal(wildcardMatch('acdcb', 'a*c?b'), false);
});

test('wildcard-match 问号与星号组合', () => {
  assert.equal(wildcardMatch('abc', 'a?c'), true);
  assert.equal(wildcardMatch('abc', '???'), true);
  assert.equal(wildcardMatch('abc', 'a*'), true);
  assert.equal(wildcardMatch('abc', '*c'), true);
  assert.equal(wildcardMatch('abc', '*a*'), true); // *a* 可匹配任意含 a 的串
  assert.equal(wildcardMatch('abcdef', 'a*f'), true);
  assert.equal(wildcardMatch('ho', '**ho'), true); // 连续星号
});

test('wildcard-match 长串', () => {
  assert.equal(wildcardMatch('mississippi', 'm??*ss*?i*pi'), false);
  assert.equal(wildcardMatch('abefcdgiescdfimde', 'ab*cd?i*de'), true);
});

test('wildcard-match 钩子被调用', () => {
  let fill = 0;
  let done: boolean | null = null;
  wildcardMatch('adceb', '*a*b', {
    onFillCell: () => fill++,
    onDone: (ok) => {
      done = ok;
    },
  });
  assert.ok(fill > 0, '应触发 onFillCell');
  assert.equal(done, true);
});
