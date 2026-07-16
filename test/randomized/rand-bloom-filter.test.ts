import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BloomFilter } from '../../src/algorithms/randomized/rand-bloom-filter/impl.ts';
test('已加入必命中', () => {
  const b = new BloomFilter(1000, 4);
  b.add('apple');
  b.add('banana');
  assert.equal(b.has('apple'), true);
  assert.equal(b.has('banana'), true);
});
