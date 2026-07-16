import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minHashSimilarity } from '../../src/algorithms/hashing/hash-minhash-set/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-minhash-set/trace.ts';
test('相同集合相似度 1', () => {
  const S = new Set([1, 2, 3]);
  assert.ok(minHashSimilarity(S, S, 20) > 0.9);
});
test('不相交集合相似度 ~0', () => {
  const e = minHashSimilarity(new Set([1, 2]), new Set([3, 4]), 20);
  assert.ok(e < 0.3);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
