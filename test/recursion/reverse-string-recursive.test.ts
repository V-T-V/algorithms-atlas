import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reverseString } from '../../src/algorithms/recursion/reverse-string-recursive/impl.ts';

test('reverseString 基本', () => {
  assert.equal(reverseString('hello'), 'olleh');
  assert.equal(reverseString('recursion'), 'noisrucer');
  assert.equal(reverseString('abc'), 'cba');
});

test('reverseString 边界', () => {
  assert.equal(reverseString(''), '');
  assert.equal(reverseString('a'), 'a');
  assert.equal(reverseString('aa'), 'aa');
});

test('reverseString 回文反转后不变', () => {
  assert.equal(reverseString('racecar'), 'racecar');
  assert.equal(reverseString('level'), 'level');
});

test('reverseString 双字节', () => {
  assert.equal(reverseString('你好世界'), '界世好你');
});

test('reverseString 双反还原', () => {
  const s = 'abcdefg';
  assert.equal(reverseString(reverseString(s)), s);
});
