import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ctz2 } from '../../src/algorithms/bitwise/bit-ctz-2/impl.ts';

function naiveCtz(x: number): number {
  if (x === 0) return -1;
  let c = 0;
  let v = x >>> 0;
  while ((v & 1) === 0) {
    c++;
    v >>>= 1;
  }
  return c;
}

test('ctz2 已知值', () => {
  assert.equal(ctz2(0), -1);
  assert.equal(ctz2(1), 0);
  assert.equal(ctz2(2), 1);
  assert.equal(ctz2(8), 3);
  assert.equal(ctz2(0x400), 10);
  assert.equal(ctz2(0x80000000), 31);
});

test('ctz2 与朴素法一致（全范围抽样）', () => {
  const samples = [
    1, 2, 3, 4, 16, 255, 256, 1024, 65536, 0x10000, 0x80000000, 0x40000000, 0x7fffffff,
  ];
  for (const s of samples) assert.equal(ctz2(s), naiveCtz(s));
});

test('ctz2 随机验证', () => {
  let seed = 42;
  for (let i = 0; i < 5000; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const x = (seed | 1) >>> 0; // 保证非 0
    assert.equal(ctz2(x), naiveCtz(x));
  }
});

test('ctz2 拒绝越界', () => {
  assert.throws(() => ctz2(-1), RangeError);
  assert.throws(() => ctz2(1.5), RangeError);
  assert.throws(() => ctz2(0x100000000), RangeError);
});
