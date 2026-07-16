import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rabinKarpRolling } from '../../src/algorithms/hashing/hash-rabin-karp-rolling-2/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-rabin-karp-rolling-2/trace.ts';
test('相同子串哈希相同', () => {
  const h = rabinKarpRolling('ABABAB', 2);
  assert.equal(h[0], h[2]);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
