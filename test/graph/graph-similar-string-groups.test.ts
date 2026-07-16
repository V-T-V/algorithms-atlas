import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numSimilarGroups } from '../../src/algorithms/graph/graph-similar-string-groups/impl.ts';

test('similar-string-groups LeetCode 839 例 1', () => {
  assert.equal(numSimilarGroups(['tars', 'rats', 'arts', 'star']), 2);
});

test('similar-string-groups LeetCode 839 例 2', () => {
  assert.equal(numSimilarGroups(['omv', 'ovm']), 1);
});

test('similar-string-groups 全相同', () => {
  assert.equal(numSimilarGroups(['abc', 'abc', 'abc']), 1);
});

test('similar-string-groups 全不同', () => {
  assert.equal(numSimilarGroups(['abcd', 'efgh', 'ijkl']), 3);
});

test('similar-string-groups 单串', () => {
  assert.equal(numSimilarGroups(['hello']), 1);
});
