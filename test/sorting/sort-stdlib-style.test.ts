import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stdlibSort } from '../../src/algorithms/sorting/sort-stdlib-style/impl.ts';

test('stdlibSort 基本排序', () => {
  assert.deepEqual(stdlibSort([]), []);
  assert.deepEqual(stdlibSort([1]), [1]);
  assert.deepEqual(stdlibSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('stdlibSort 已有序/逆序/重复', () => {
  assert.deepEqual(stdlibSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(stdlibSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(stdlibSort([3, 1, 3, 2, 1]), [1, 1, 2, 3, 3]);
});

test('stdlibSort 大数组仍有序', () => {
  const big = Array.from({ length: 200 }, (_, i) => (i * 37) % 200);
  const r = stdlibSort(big);
  for (let i = 1; i < r.length; i++) assert.ok(r[i - 1]! <= r[i]!);
});

test('stdlibSort 不修改原数组', () => {
  const input = [3, 1, 2];
  stdlibSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('stdlibSort 小段用插入排序', () => {
  let insertionUsed = false;
  stdlibSort([2, 1], {
    onStrategy: (_lo, _hi, kind) => {
      if (kind === 'insertion') insertionUsed = true;
    },
  });
  assert.ok(insertionUsed);
});
