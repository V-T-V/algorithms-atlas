import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeBits } from '../../src/algorithms/bitwise/bit-merge-bits/impl.ts';

test('mergeBits 基本', () => {
  // m=0 全取 x；m=0xffffffff 全取 y
  assert.equal(mergeBits(0x12345678, 0xdeadbeef, 0), 0x12345678);
  assert.equal(mergeBits(0x12345678, 0xdeadbeef, 0xffffffff), 0xdeadbeef);
});

test('mergeBits 混合掩码', () => {
  // x=0xf0f0f0f0, y=0x0f0f0f0f, m=0xffff0000
  // x & ~m = 0xf0f0f0f0 & 0x0000ffff = 0x0000f0f0
  // y & m  = 0x0f0f0f0f & 0xffff0000 = 0x0f0f0000
  // result = 0x0f0ff0f0
  assert.equal(mergeBits(0xf0f0f0f0, 0x0f0f0f0f, 0xffff0000), 0x0f0ff0f0);
  // m=0x0f0f0f0f 交替
  assert.equal(mergeBits(0xaaaaaaaa, 0x55555555, 0x0f0f0f0f), 0x5a5a5a5a);
});

test('mergeBits 单位验证', () => {
  for (let i = 0; i < 32; i++) {
    const m = 1 << i;
    // m=1 处取 y，m=0 处取 x
    assert.equal(mergeBits(0, 0xffffffff, m >>> 0) & (m >>> 0), m >>> 0);
    assert.equal(mergeBits(0xffffffff, 0, m >>> 0) & ~(m >>> 0) & 0xffffffff, ~m >>> 0);
  }
});

test('mergeBits 拒绝越界', () => {
  assert.throws(() => mergeBits(-1, 0, 0), RangeError);
  assert.throws(() => mergeBits(0, 1.5, 0), RangeError);
  assert.throws(() => mergeBits(0, 0, 0x100000000), RangeError);
});
