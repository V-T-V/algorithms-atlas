import { test } from 'node:test';
import assert from 'node:assert/strict';
import { partialKeyHash } from '../../src/algorithms/hashing/hash-partial-key/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-partial-key/trace.ts';
test('相同键哈希相同', () => {
  const h = partialKeyHash([0x12345678, 0x12345678], 0xff);
  assert.equal(h[0], h[1]);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
