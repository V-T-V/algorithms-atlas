import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trieautocomplete } from '../../src/algorithms/tree/trie-autocomplete/impl.ts';

test('trie-autocomplete 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof trieautocomplete === 'function');
});
