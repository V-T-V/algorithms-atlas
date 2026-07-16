import { test } from 'node:test';
import assert from 'node:assert/strict';
import { triedelete } from '../../src/algorithms/tree/trie-delete/impl.ts';

test('trie-delete 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof triedelete === 'function');
});
