import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  countSubstrings,
  listPalindromes,
} from '../../src/algorithms/string/palindrome-substrings/impl.ts';

test('countSubstrings 基本用例', () => {
  assert.equal(countSubstrings('abc'), 3); // a, b, c
  assert.equal(countSubstrings('aaa'), 6); // a,a,a,aa,aa,aaa
});

test('countSubstrings 全相同', () => {
  assert.equal(countSubstrings('aaaa'), 10);
  assert.equal(countSubstrings('a'), 1);
});

test('countSubstrings 无长度 >=2 回文', () => {
  assert.equal(countSubstrings('abcd'), 4);
  assert.equal(countSubstrings('abca'), 4);
});

test('countSubstrings 偶数回文', () => {
  assert.equal(countSubstrings('abba'), 6); // a,b,b,a,bb,abba
});

test('countSubstrings 空串', () => {
  assert.equal(countSubstrings(''), 0);
});

test('listPalindromes 列出全部', () => {
  // "aaa" 的回文（按中心扩展顺序）
  const ps = listPalindromes('aaa');
  assert.equal(ps.length, 6);
  // 应包含各种子串
  for (const want of ['a', 'aa', 'aaa']) {
    assert.ok(ps.includes(want), `应包含 '${want}'`);
  }
});

test('countSubstrings 钩子被调用', () => {
  let expands = 0;
  countSubstrings('aa', {
    onExpand: () => expands++,
  });
  assert.ok(expands >= 1, '应至少扩展一次');
});
