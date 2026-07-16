import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clz2 } from '../../src/algorithms/bitwise/bit-clz-2/impl.ts';

function naiveClz(x: number): number {
  return (x >>> 0).toString(2).padStart(32, '0').indexOf('1');
}

test('clz2 已知值', () => {
  assert.equal(clz2(0), 32);
  assert.equal(clz2(0xffffffff), 0);
  assert.equal(clz2(1), 31);
  assert.equal(clz2(0x80000000), 0);
  assert.equal(clz2(0x40000000), 1);
  assert.equal(clz2(0x4000), 17);
});

test('clz2 与朴素法一致', () => {
  const samples = [
    0, 1, 2, 3, 8, 255, 256, 0x400, 0x80000000, 0x7fffffff, 0xffff, 0x10000, 0xdeadbeef, 0x12345678,
    0xffffffff,
  ];
  for (const s of samples) assert.equal(clz2(s), s === 0 ? 32 : naiveClz(s));
});

test('clz2 随机验证', () => {
  let seed = 7;
  for (let i = 0; i < 20000; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const x = (seed | 1) >>> 0;
    assert.equal(clz2(x), naiveClz(x));
  }
});

test('clz2 拒绝越界', () => {
  assert.throws(() => clz2(-1), RangeError);
  assert.throws(() => clz2(1.5), RangeError);
  assert.throws(() => clz2(0x100000000), RangeError);
});
