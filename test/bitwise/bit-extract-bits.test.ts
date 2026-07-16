import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractBits } from '../../src/algorithms/bitwise/bit-extract-bits/impl.ts';
import { depositBits } from '../../src/algorithms/bitwise/bit-deposit-bits/impl.ts';

test('extractBits 基本', () => {
  assert.equal(extractBits(0, 0), 0);
  assert.equal(extractBits(0xff, 0xf0), 0xf); // 高 4 位全 1 → 压缩成 1111
  assert.equal(extractBits(0xff, 0x0f), 0xf); // 低 4 位全 1
  assert.equal(extractBits(0b1011, 0b0101), 0b01); // pos0(x=1),pos2(x=0) → 01
});

test('extractBits m=0 返回 0', () => {
  assert.equal(extractBits(0xffffffff, 0), 0);
});

test('extractBits 与 depositBits 互逆', () => {
  const xs = [0x12345678, 0xdeadbeef, 0xffffffff, 0, 0xaaaa5555];
  const ms = [0x0f0f0f0f, 0x0000ffff, 0xaaaaaaaa, 0x1, 0x80000000];
  for (const x of xs) {
    for (const m of ms) {
      const e = extractBits(x, m);
      // deposit(extract(x,m), m) === x & m
      assert.equal(depositBits(e, m) >>> 0, (x & m) >>> 0);
    }
  }
});

test('extractBits m=0xffffffff 提取全部', () => {
  assert.equal(extractBits(0x12345678, 0xffffffff), 0x12345678);
});

test('extractBits 拒绝越界', () => {
  assert.throws(() => extractBits(-1, 0), RangeError);
  assert.throws(() => extractBits(0, 1.5), RangeError);
  assert.throws(() => extractBits(0, 0x100000000), RangeError);
});
