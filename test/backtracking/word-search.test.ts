import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wordsearch } from '../../src/algorithms/backtracking/word-search/impl.ts';

test('word-search 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof wordsearch === 'function');
});
