import { test } from 'node:test';
import assert from 'node:assert/strict';
import { murmur3_32 } from '../../src/algorithms/hashing/hash-murmur3-x86/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-murmur3-x86/trace.ts';
test('Murmur3 确定性', () => {
  assert.equal(murmur3_32('abc', 42), murmur3_32('abc', 42));
  assert.notEqual(murmur3_32('abc', 1), murmur3_32('abc', 2));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
