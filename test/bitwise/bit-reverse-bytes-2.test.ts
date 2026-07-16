import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bswap32 } from '../../src/algorithms/bitwise/bit-reverse-bytes-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-reverse-bytes-2/trace.ts';
test('bswap32 正确', () => {
  assert.equal(bswap32(0x12345678), 0x78563412);
  assert.equal(bswap32(0x000000ff), 0xff000000);
  assert.equal(bswap32(0xff000000), 0x000000ff);
  assert.equal(bswap32(0xdeadbeef), 0xefbeadde);
});
test('bswap32 自逆', () => {
  for (const x of [0x12345678, 0xdeadbeef, 0x00ff00ff]) assert.equal(bswap32(bswap32(x)), x >>> 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
