import { test } from 'node:test';
import assert from 'node:assert/strict';
import { longestWord } from '../../src/algorithms/recursion/rec-longest-word-dfs/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-longest-word-dfs/trace.ts';

test('rec-longest-word-dfs 基本用例', () => {
  assert.equal(longestWord(['w', 'wo', 'wor', 'worl', 'world']), 'world');
});

test('rec-longest-word-dfs 字典序最小', () => {
  // a, banana, app, appl, apple, apply -> 长度 5 取字典序最小 apple
  assert.equal(longestWord(['a', 'banana', 'app', 'appl', 'apple', 'apply']), 'apple');
});

test('rec-longest-word-dfs 无单字母前缀', () => {
  // 无单个字母，无法构建
  assert.equal(longestWord(['abc', 'ab']), '');
});

test('rec-longest-word-dfs 空列表', () => {
  assert.equal(longestWord([]), '');
});

test('rec-longest-word-dfs trace', () => {
  assert.ok(buildTrace().length > 2);
});
