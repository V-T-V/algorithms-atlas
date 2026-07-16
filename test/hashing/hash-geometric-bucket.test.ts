import { test } from 'node:test';
import assert from 'node:assert/strict';
import { geometricBucket } from '../../src/algorithms/hashing/hash-geometric-bucket/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-geometric-bucket/trace.ts';
test('相同数量级落同桶', () => {
  const c = geometricBucket([2, 3]);
  assert.equal(c.size, 1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
