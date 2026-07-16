import { test } from 'node:test';
import assert from 'node:assert/strict';
import { regexMatch } from '../../src/algorithms/dp/regex-match/impl.ts';

test('regex-match 基本行为', () => {
  assert.equal(regexMatch('', ''), true);
  assert.equal(regexMatch('', 'a*'), true); // a* 可 0 次
  assert.equal(regexMatch('', 'a'), false);
  assert.equal(regexMatch('a', ''), false);
});

test('regex-match 经典用例', () => {
  // LeetCode 10 示例
  assert.equal(regexMatch('aa', 'a'), false);
  assert.equal(regexMatch('aa', 'a*'), true);
  assert.equal(regexMatch('ab', '.*'), true);
  assert.equal(regexMatch('aab', 'c*a*b'), true);
  assert.equal(regexMatch('mississippi', 'mis*is*p*.'), false);
});

test('regex-match 点号与星号组合', () => {
  assert.equal(regexMatch('abc', 'a.c'), true);
  assert.equal(regexMatch('abc', 'a.b'), false);
  assert.equal(regexMatch('aaa', 'a*a'), true);
  assert.equal(regexMatch('aaa', 'ab*a*c*a'), true);
  assert.equal(regexMatch('abcd', 'd*'), false);
  assert.equal(regexMatch('a', 'ab*'), true); // b* 取 0 次
});

test('regex-match 钩子被调用', () => {
  let fill = 0;
  let done: boolean | null = null;
  regexMatch('aab', 'c*a*b', {
    onFillCell: () => fill++,
    onDone: (ok) => {
      done = ok;
    },
  });
  assert.ok(fill > 0, '应触发 onFillCell');
  assert.equal(done, true);
});
