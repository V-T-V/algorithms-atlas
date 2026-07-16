import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xxh3Mix } from '../../src/algorithms/hashing/hash-xxh3-mix/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-xxh3-mix/trace.ts';
test('XXH3 确定性', () => {
  assert.equal(xxh3Mix('abc'), xxh3Mix('abc'));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
