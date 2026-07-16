import { test } from 'node:test';
import assert from 'node:assert/strict';
import { longestCommonPrefix } from '../../src/algorithms/string/longest-common-prefix-impl/impl.ts';

test('longestCommonPrefix 基本用例', () => {
  assert.equal(longestCommonPrefix(['flower', 'flow', 'flight']), 'fl');
  assert.equal(longestCommonPrefix(['dog', 'racecar', 'car']), '');
});

test('longestCommonPrefix 全相同', () => {
  assert.equal(longestCommonPrefix(['abc', 'abc', 'abc']), 'abc');
  assert.equal(longestCommonPrefix(['a']), 'a');
});

test('longestCommonPrefix 单串', () => {
  assert.equal(longestCommonPrefix(['hello']), 'hello');
});

test('longestCommonPrefix 含空串', () => {
  assert.equal(longestCommonPrefix(['', 'abc']), '');
  assert.equal(longestCommonPrefix(['abc', '']), '');
});

test('longestCommonPrefix 空数组', () => {
  assert.equal(longestCommonPrefix([]), '');
});

test('longestCommonPrefix 前缀为短串本身', () => {
  assert.equal(longestCommonPrefix(['ab', 'abc', 'abcd']), 'ab');
});

test('longestCommonPrefix 钩子被调用', () => {
  let compares = 0;
  let matches = 0;
  longestCommonPrefix(['flower', 'flow', 'flight'], {
    onColumnCompare: () => compares++,
    onColumnMatch: () => matches++,
  });
  assert.ok(compares >= 1, '应至少比较一列');
  assert.ok(matches >= 1, '应至少匹配一列');
});
