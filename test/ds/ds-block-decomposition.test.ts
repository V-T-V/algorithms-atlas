import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BlockArray } from '../../src/algorithms/ds/ds-block-decomposition/impl.ts';

test('BlockArray 区间和', () => {
  const ba = new BlockArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(ba.rangeSum(0, 9), 55);
  assert.equal(ba.rangeSum(2, 7), 3 + 4 + 5 + 6 + 7 + 8);
  assert.equal(ba.rangeSum(4, 5), 11); // arr[4]+arr[5] = 5+6
  assert.equal(ba.rangeSum(0, 0), 1);
});

test('BlockArray 点修改', () => {
  const ba = new BlockArray([1, 2, 3, 4, 5]);
  ba.update(2, 100);
  assert.equal(ba.data[2], 100);
  assert.equal(ba.rangeSum(0, 4), 1 + 2 + 100 + 4 + 5);
});

test('BlockArray add', () => {
  const ba = new BlockArray([1, 2, 3, 4, 5]);
  ba.add(0, 10);
  assert.equal(ba.rangeSum(0, 0), 11);
});

test('BlockArray 空数组', () => {
  const ba = new BlockArray([]);
  assert.equal(ba.rangeSum(0, 0), 0);
});

test('BlockArray 单元素', () => {
  const ba = new BlockArray([42]);
  assert.equal(ba.rangeSum(0, 0), 42);
});

test('BlockArray 区间和与朴素对照', () => {
  const arr = Array.from({ length: 100 }, (_, i) => i * 2 + 1);
  const ba = new BlockArray(arr);
  const naive = (l: number, r: number): number => {
    let s = 0;
    for (let i = l; i <= r; i++) s += arr[i]!;
    return s;
  };
  for (const [l, r] of [
    [0, 99],
    [10, 50],
    [3, 3],
    [0, 4],
    [95, 99],
  ] as Array<[number, number]>) {
    assert.equal(ba.rangeSum(l, r), naive(l, r), `${l}-${r}`);
  }
});

test('BlockArray 多次更新后再查', () => {
  const ba = new BlockArray([1, 1, 1, 1, 1, 1, 1, 1, 1]);
  ba.update(0, 10);
  ba.update(8, 10);
  ba.update(4, 20);
  assert.equal(ba.rangeSum(0, 8), 10 + 1 + 1 + 1 + 20 + 1 + 1 + 1 + 10);
});
