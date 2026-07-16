import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crc32 } from '../../src/algorithms/hashing/hash-crc32/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-crc32/trace.ts';
test('CRC32 标准校验值', () => {
  assert.equal(crc32('123456789'), 0xcbf43926);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
