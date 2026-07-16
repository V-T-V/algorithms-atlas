import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gzipWrap, crc32 } from '../../src/algorithms/compression/comp-gzip-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-gzip-2/trace.ts';

test('crc32 已知值', () => {
  // CRC32 of "" = 0
  assert.equal(crc32([]), 0);
  // CRC32 of "123456789" = 0xCBF43926
  assert.equal(crc32([49, 50, 51, 52, 53, 54, 55, 56, 57]), 0xcbf43926);
});
test('gzip wrap 生成头部', () => {
  const r = gzipWrap('abc', 3);
  assert.equal(r.header[0], 0x1f);
  assert.equal(r.header[1], 0x8b);
});
test('gzip trace 非空', () => assert.ok(buildTrace().length > 0));
