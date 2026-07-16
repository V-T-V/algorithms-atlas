import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CuckooHash } from '../../src/algorithms/randomized/rand-cuckoo-hash/impl.ts';
test('插入后可查', () => {
  const h = new CuckooHash(50);
  for (const k of [1, 5, 9, 13, 17]) h.insert(k);
  assert.equal(h.has(5), true);
  assert.equal(h.has(100), false);
});
