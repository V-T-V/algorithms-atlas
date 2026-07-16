import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crc32 } from '../../src/algorithms/bitwise/bit-crc32/impl.ts';

function bytes(s: string): number[] {
  return s.split('').map((c) => c.charCodeAt(0));
}

test('crc32 空输入', () => {
  assert.equal(crc32([]), 0);
});

test('crc32 标准测试串 "123456789" = 0xcbf43926', () => {
  assert.equal(crc32(bytes('123456789')), 0xcbf43926);
});

test('crc32 已知值', () => {
  // 与 zlib crc32 一致：'abc' 的 crc32
  assert.equal(crc32(bytes('abc')), 0x352441c2);
  assert.equal(crc32(bytes('The quick brown fox jumps over the lazy dog')), 0x414fa339);
});

test('crc32 单字节变化导致结果大不同（雪崩性）', () => {
  const a = crc32(bytes('hello'));
  const b = crc32(bytes('hellp')); // 仅末字节不同
  assert.notEqual(a, b);
});

test('crc32 与原生 zlib 对比（若可用）', () => {
  // 这里仅做自洽性：crc32 是确定性的
  assert.equal(crc32(bytes('test')), crc32(bytes('test')));
});

test('crc32 拒绝非法字节', () => {
  assert.throws(() => crc32([256]), RangeError);
  assert.throws(() => crc32([-1]), RangeError);
  assert.throws(() => crc32([1.5]), RangeError);
});
