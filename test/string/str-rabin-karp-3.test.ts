import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rabinKarp } from '../../src/algorithms/string/str-rabin-karp-3/impl.ts';

test('rabin-karp 基础匹配', () => {
  assert.deepEqual(rabinKarp('AABAACAADAABAABA', 'AABA'), [0, 9, 12]);
});

test('rabin-karp 无匹配', () => {
  assert.deepEqual(rabinKarp('ABCDEF', 'XYZ'), []);
});

test('rabin-karp 单字符', () => {
  assert.deepEqual(rabinKarp('AAA', 'A'), [0, 1, 2]);
});
