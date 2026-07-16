import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btWildcardMatching } from '../../src/algorithms/backtracking/bt-wildcard-matching-bt/impl.ts';

test('bt-wildcard-matching 基本用例', () => {
  assert.equal(btWildcardMatching('aa', 'a'), false);
  assert.equal(btWildcardMatching('aa', '*'), true);
  assert.equal(btWildcardMatching('cb', '?a'), false);
  assert.equal(btWildcardMatching('adceb', '*a*b'), true);
  assert.equal(btWildcardMatching('acdcb', 'a*c?b'), false);
});

test('bt-wildcard-matching 空', () => {
  assert.equal(btWildcardMatching('', ''), true);
  assert.equal(btWildcardMatching('', '*'), true);
  assert.equal(btWildcardMatching('a', ''), false);
});

test('bt-wildcard-matching 连续星号', () => {
  assert.equal(btWildcardMatching('abc', '***'), true);
  assert.equal(btWildcardMatching('abc', 'a**c'), true);
});
