import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bswap } from '../../src/algorithms/bitwise/bit-bswap/impl.ts';

test('bswap 已知值', () => {
  assert.equal(bswap(0), 0);
  assert.equal(bswap(0x12345678), 0x78563412);
  assert.equal(bswap(0xdeadbeef), 0xefbeadde);
  assert.equal(bswap(0x000000ff), 0xff000000);
  assert.equal(bswap(0xff000000), 0x000000ff);
});

test('bswap 自反性：bswap(bswap(x)) === x', () => {
  const samples = [0, 1, 0xff, 0x12345678, 0xdeadbeef, 0xffffffff, 0x80808080];
  for (const s of samples) assert.equal(bswap(bswap(s)), s >>> 0);
  let seed = 99;
  for (let i = 0; i < 5000; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    assert.equal(bswap(bswap(seed)), seed >>> 0);
  }
});

test('bswap 拒绝越界', () => {
  assert.throws(() => bswap(-1), RangeError);
  assert.throws(() => bswap(1.5), RangeError);
  assert.throws(() => bswap(0x100000000), RangeError);
});
