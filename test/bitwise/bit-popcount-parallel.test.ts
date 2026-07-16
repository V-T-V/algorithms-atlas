import { test } from 'node:test';
import assert from 'node:assert/strict';
import { popcountParallel } from '../../src/algorithms/bitwise/bit-popcount-parallel/impl.ts';

function naive(x: number): number {
  return (x >>> 0).toString(2).replace(/0/g, '').length;
}

test('popcountParallel 边界与已知值', () => {
  assert.equal(popcountParallel(0), 0);
  assert.equal(popcountParallel(1), 1);
  assert.equal(popcountParallel(0xffffffff), 32);
  assert.equal(popcountParallel(0x7ffff07f), 22);
});

test('popcountParallel 与朴素法一致（全范围抽样）', () => {
  const samples = [
    0, 1, 2, 3, 7, 255, 256, 65535, 1000000, 0x7fffffff, 0x80000000, 0xdeadbeef, 0x12345678,
  ];
  for (const s of samples) {
    assert.equal(popcountParallel(s), naive(s), `mismatch at ${s}`);
  }
});

test('popcountParallel 大规模随机验证', () => {
  let seed = 12345;
  for (let i = 0; i < 10000; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const x = seed;
    assert.equal(popcountParallel(x), naive(x));
  }
});

test('popcountParallel 拒绝越界输入', () => {
  assert.throws(() => popcountParallel(-1), RangeError);
  assert.throws(() => popcountParallel(1.5), RangeError);
  assert.throws(() => popcountParallel(0x100000000), RangeError);
});
