import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  countSetBitsRange,
  countSetBitsUpTo,
  countSetBitsRangeNaive,
} from '../../src/algorithms/bitwise/bitwise-count-ones-range/impl.ts';

test('countSetBitsUpTo 与朴素法一致', () => {
  for (const n of [0, 1, 2, 3, 7, 8, 15, 16, 100, 255]) {
    let naive = 0;
    for (let v = 0; v <= n; v++) {
      let c = 0;
      let x = v;
      while (x > 0) {
        x -= x & -x;
        c++;
      }
      naive += c;
    }
    assert.equal(countSetBitsUpTo(n), naive, `S(${n})`);
  }
});

test('countSetBitsRange 与朴素法一致', () => {
  for (const [lo, hi] of [
    [0, 0],
    [0, 15],
    [3, 9],
    [5, 5],
    [10, 50],
    [0, 100],
  ] as const) {
    assert.equal(countSetBitsRange(lo, hi), countSetBitsRangeNaive(lo, hi), `[${lo},${hi}]`);
  }
});

test('countSetBitsRange 边界', () => {
  assert.equal(countSetBitsRange(0, 0), 0);
  assert.equal(countSetBitsRange(1, 1), 1);
  assert.equal(countSetBitsRange(0, 3), 4); // 0,1,1,2
});

test('countSetBitsRange 拒绝非法区间', () => {
  assert.throws(() => countSetBitsRange(-1, 5), RangeError);
  assert.throws(() => countSetBitsRange(5, 3), RangeError);
});
