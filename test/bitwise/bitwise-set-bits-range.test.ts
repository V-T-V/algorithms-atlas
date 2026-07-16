import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setBitsRange } from '../../src/algorithms/bitwise/bitwise-set-bits-range/impl.ts';

test('setBitsRange: 基本区间 [4,9] 置位', () => {
  assert.equal(setBitsRange(0, 4, 9), 0b111111_0000); // 0x3F0
});

test('setBitsRange: 单位置位等价于 value | (1<<lo)', () => {
  assert.equal(setBitsRange(0, 3, 3), 1 << 3);
});

test('setBitsRange: 不影响已有位', () => {
  // 0b1000001 (位0、位6) 置位 [2,4] → 位0,2,3,4,6 = 0b1011101
  assert.equal(setBitsRange(0b1000001, 2, 4), 0b1011101);
});

test('setBitsRange: 已是 1 的位保持 1', () => {
  const before = 0xffffffff >>> 0;
  assert.equal(setBitsRange(before, 5, 10), before);
});

test('setBitsRange: 与朴素逐位方法一致（随机）', () => {
  const naive = (value: number, lo: number, hi: number): number => {
    let r = value;
    for (let i = lo; i <= hi; i++) r |= 1 << i;
    return r >>> 0;
  };
  const cases: Array<[number, number, number]> = [
    [0, 0, 7],
    [0, 0, 0],
    [1, 1, 10],
    [0xffff, 4, 9],
    [0x12345678, 0, 15],
    [7, 3, 5],
    [0, 10, 20],
  ];
  for (const [v, lo, hi] of cases) {
    assert.equal(setBitsRange(v, lo, hi), naive(v, lo, hi));
  }
});

test('setBitsRange: hooks 正确回调', () => {
  let mask: number | null = null;
  let done: number | null = null;
  setBitsRange(0, 2, 5, {
    onMask: (m) => (mask = m),
    onDone: (r) => (done = r),
  });
  // [2,5] → len=4 → mask 0b1111 << 2 = 0b111100 = 60
  assert.equal(mask, 0b111100);
  assert.equal(done, 0b111100);
});

test('setBitsRange: 非法入参抛错', () => {
  assert.throws(() => setBitsRange(-1, 0, 3), RangeError);
  assert.throws(() => setBitsRange(0, -1, 3), RangeError);
  assert.throws(() => setBitsRange(0, 5, 2), RangeError);
  assert.throws(() => setBitsRange(0, 0, 31), RangeError); // 超 30 位
  assert.throws(() => setBitsRange(0, 1.5, 3), TypeError);
});
