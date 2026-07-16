import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fnv1_32 } from '../../src/algorithms/hashing/hash-fnv1-32/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-fnv1-32/trace.ts';
test('FNV-1 确定性', () => {
  assert.equal(fnv1_32('abc'), fnv1_32('abc'));
  assert.notEqual(fnv1_32('abc'), fnv1_32('abd'));
});
test('空串返回 offset', () => {
  assert.equal(fnv1_32(''), 0x811c9dc5);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
