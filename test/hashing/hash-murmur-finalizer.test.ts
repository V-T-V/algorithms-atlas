import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  murmurFinalizer,
  avalancheScore,
} from '../../src/algorithms/hashing/hash-murmur-finalizer/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-murmur-finalizer/trace.ts';
test('fmix32 确定性', () => {
  assert.equal(murmurFinalizer(42), murmurFinalizer(42));
});
test('雪崩分数接近 16 位', () => {
  assert.ok(avalancheScore() > 14);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
