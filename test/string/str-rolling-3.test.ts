import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rollingHash } from '../../src/algorithms/string/str-rolling-3/impl.ts';

test('rolling hash 重复窗口相等', () => {
  const hashes = rollingHash('abcabcabc', 3);
  // [abc,bca,cab,abc,bca,cab,abc]
  assert.equal(hashes[0], hashes[3]);
  assert.equal(hashes[0], hashes[6]);
});

test('rolling hash 不同窗口不等', () => {
  const hashes = rollingHash('abcdef', 3);
  assert.notEqual(hashes[0], hashes[1]);
});
