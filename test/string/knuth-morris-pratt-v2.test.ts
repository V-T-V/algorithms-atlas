import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  kmpSearch,
  prefixFunction,
} from '../../src/algorithms/string/knuth-morris-pratt-v2/impl.ts';

test('kmpSearch 单次匹配', () => {
  assert.deepEqual(kmpSearch('hello world', 'world'), [6]);
  assert.deepEqual(kmpSearch('abcdefg', 'cd'), [2]);
});

test('kmpSearch 多次匹配', () => {
  assert.deepEqual(kmpSearch('abababab', 'abab'), [0, 2, 4]);
  assert.deepEqual(kmpSearch('aaaaa', 'aa'), [0, 1, 2, 3]);
  assert.deepEqual(kmpSearch('ababcababacabab', 'abab'), [0, 5, 11]);
});

test('kmpSearch 无匹配', () => {
  assert.deepEqual(kmpSearch('abcdef', 'xyz'), []);
  assert.deepEqual(kmpSearch('abc', 'abcd'), []); // 模式比文本长
  assert.deepEqual(kmpSearch('abc', ''), []); // 空模式
});

test('prefixFunction 正确', () => {
  assert.deepEqual(prefixFunction('ababac'), [0, 0, 1, 2, 3, 0]);
  assert.deepEqual(prefixFunction('aaaa'), [0, 1, 2, 3]);
  assert.deepEqual(prefixFunction('abcde'), [0, 0, 0, 0, 0]);
  assert.deepEqual(prefixFunction('aabaabaaaab'), [0, 1, 0, 1, 2, 3, 4, 5, 2, 2, 3]);
});

test('kmpSearch 钩子被调用', () => {
  let compares = 0;
  let matches = 0;
  kmpSearch('ababab', 'abab', {
    onMatchCompare: () => compares++,
    onMatch: () => matches++,
  });
  assert.ok(compares >= 1, '应至少比较一次');
  assert.ok(matches >= 1, '应至少匹配一次');
});

test('kmpSearch 完整匹配不遗漏（重叠匹配）', () => {
  assert.deepEqual(kmpSearch('abcabcabc', 'abcabc'), [0, 3]);
});
