import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btRegexMatching } from '../../src/algorithms/backtracking/bt-regex-matching-bt/impl.ts';

test('bt-regex-matching 基本用例', () => {
  assert.equal(btRegexMatching('aa', 'a'), false);
  assert.equal(btRegexMatching('aa', 'a*'), true);
  assert.equal(btRegexMatching('ab', '.*'), true);
  assert.equal(btRegexMatching('aab', 'c*a*b'), true);
  assert.equal(btRegexMatching('mississippi', 'mis*is*p*.'), false);
});

test('bt-regex-matching 空', () => {
  assert.equal(btRegexMatching('', '.*'), true);
  assert.equal(btRegexMatching('', 'a*'), true);
  assert.equal(btRegexMatching('a', ''), false);
});

test('bt-regex-matching 点号', () => {
  assert.equal(btRegexMatching('abc', 'a.c'), true);
  assert.equal(btRegexMatching('abc', 'a.b'), false);
});
