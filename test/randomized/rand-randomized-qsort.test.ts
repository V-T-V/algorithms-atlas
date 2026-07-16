import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  randomizedQuicksort,
  makeRng,
} from '../../src/algorithms/randomized/rand-randomized-qsort/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-randomized-qsort/trace.ts';

test('rand-randomized-qsort 排序正确', () => {
  const r = randomizedQuicksort([5, 3, 8, 1, 9, 2, 7, 4, 6, 0], makeRng(42));
  assert.deepEqual(r, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('rand-randomized-qsort 空与单元素', () => {
  assert.deepEqual(randomizedQuicksort([], makeRng(1)), []);
  assert.deepEqual(randomizedQuicksort([42], makeRng(1)), [42]);
});

test('rand-randomized-qsort 已排序输入', () => {
  assert.deepEqual(randomizedQuicksort([1, 2, 3, 4, 5], makeRng(7)), [1, 2, 3, 4, 5]);
});

test('rand-randomized-qsort 不修改原数组', () => {
  const input = [3, 1, 2];
  randomizedQuicksort(input, makeRng(1));
  assert.deepEqual(input, [3, 1, 2]);
});

test('rand-randomized-qsort 钩子被调用', () => {
  let swaps = 0;
  let pivots = 0;
  randomizedQuicksort([3, 1, 2], makeRng(1), {
    onSwap: () => swaps++,
    onPivot: () => pivots++,
  });
  assert.ok(pivots > 0);
  void swaps;
});

test('rand-randomized-qsort trace', () => {
  assert.ok(buildTrace().length > 2);
});
