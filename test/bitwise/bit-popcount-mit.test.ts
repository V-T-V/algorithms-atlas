import { test } from 'node:test';
import assert from 'node:assert/strict';
import { popcountMit } from '../../src/algorithms/bitwise/bit-popcount-mit/impl.ts';

function naive(x: number): number {
  return (x >>> 0).toString(2).replace(/0/g, '').length;
}

test('popcountMit 已知值', () => {
  assert.equal(popcountMit(0), 0);
  assert.equal(popcountMit(0xffffffff), 32);
  assert.equal(popcountMit(0xdeadbeef), 24);
  assert.equal(popcountMit(1), 1);
});

test('popcountMit 与朴素法一致', () => {
  const samples = [
    0, 1, 3, 255, 256, 65535, 1000000, 0x7fffffff, 0x80000000, 0xdeadbeef, 0x12345678,
  ];
  for (const s of samples) assert.equal(popcountMit(s), naive(s));
});

test('popcountMit 随机验证', () => {
  let seed = 777;
  for (let i = 0; i < 5000; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    assert.equal(popcountMit(seed), naive(seed));
  }
});

test('popcountMit 拒绝越界', () => {
  assert.throws(() => popcountMit(-1), RangeError);
  assert.throws(() => popcountMit(2.5), RangeError);
  assert.throws(() => popcountMit(0x100000000), RangeError);
});
