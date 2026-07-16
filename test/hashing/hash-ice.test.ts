import { test } from 'node:test';
import assert from 'node:assert/strict';
import { iceHash } from '../../src/algorithms/hashing/hash-ice/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-ice/trace.ts';
test('ICE 确定性', () => {
  assert.equal(iceHash(42), iceHash(42));
});
test('雪崩: 相邻键差异大', () => {
  assert.notEqual(iceHash(1), iceHash(2));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
