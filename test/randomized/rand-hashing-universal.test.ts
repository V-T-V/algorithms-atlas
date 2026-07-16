import { test } from 'node:test';
import assert from 'node:assert/strict';
import { UniversalHash } from '../../src/algorithms/randomized/rand-hashing-universal/impl.ts';
test('哈希值在范围内', () => {
  const h = new UniversalHash(100, 42);
  for (let i = 0; i < 1000; i++) {
    const v = h.hash(i);
    assert.ok(v >= 0 && v < 100);
  }
});
