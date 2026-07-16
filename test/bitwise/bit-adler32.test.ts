import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adler32 } from '../../src/algorithms/bitwise/bit-adler32/impl.ts';

function bytes(s: string): number[] {
  return s.split('').map((c) => c.charCodeAt(0));
}

test('adler32 空输入 = 1', () => {
  assert.equal(adler32([]), 1);
});

test('adler32 单字节', () => {
  // s1=(1+97)%65521=98, s2=(0+98)=98 → (98<<16)|98
  assert.equal(adler32([97]), (98 << 16) | 98);
});

test('adler32 "Wikipedia" = 0x11E60398（标准参考值）', () => {
  assert.equal(adler32(bytes('Wikipedia')), 0x11e60398);
});

test('adler32 与 zlib 参考值对比', () => {
  // 已知：adler32("abc") 在 zlib 中为 0x024d0127
  assert.equal(adler32(bytes('abc')), 0x024d0127);
});

test('adler32 拒绝非法字节', () => {
  assert.throws(() => adler32([256]), RangeError);
  assert.throws(() => adler32([-1]), RangeError);
  assert.throws(() => adler32([1.5]), RangeError);
});
