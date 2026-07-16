import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hllDemo } from '../../src/algorithms/hashing/hash-hyperloglog-estimate/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-hyperloglog-estimate/trace.ts';
test('HLL 返回正估计', () => {
  const e = hllDemo([1, 2, 3, 4, 5]);
  assert.ok(e > 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
