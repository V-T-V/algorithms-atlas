import { test } from 'node:test';
import assert from 'node:assert/strict';
import { expandBraces } from '../../src/algorithms/graph/graph-brace-expansion/impl.ts';

test('brace-expansion LeetCode 1087 例 1', () => {
  assert.deepEqual(expandBraces('{a,b}c{d,e}f'), ['acdf', 'acef', 'bcdf', 'bcef']);
});

test('brace-expansion LeetCode 1087 例 2', () => {
  assert.deepEqual(expandBraces('abcd'), ['abcd']);
});

test('brace-expansion 单花括号排序', () => {
  assert.deepEqual(expandBraces('{c,b,a}'), ['a', 'b', 'c']);
});

test('brace-expansion 纯字母', () => {
  assert.deepEqual(expandBraces('xy'), ['xy']);
});

test('brace-expansion 多重嵌套不重叠', () => {
  assert.deepEqual(expandBraces('{a,b}{1,2}'), ['a1', 'a2', 'b1', 'b2']);
});
