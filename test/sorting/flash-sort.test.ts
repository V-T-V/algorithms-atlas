import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flashSort } from '../../src/algorithms/sorting/flash-sort/impl.ts';

test('flashSort 基本排序', () => {
  assert.deepEqual(flashSort([]), []);
  assert.deepEqual(flashSort([1]), [1]);
  assert.deepEqual(flashSort([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
  assert.deepEqual(flashSort([8, 4, 1, 5, 9, 2, 6, 3, 7, 0]), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('flashSort 已有序 / 逆序 / 重复 / 全等', () => {
  assert.deepEqual(flashSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(flashSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(flashSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
  assert.deepEqual(flashSort([7, 7, 7, 7]), [7, 7, 7, 7]);
});

test('flashSort 不修改原数组', () => {
  const input = [3, 1, 2];
  flashSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('flashSort 随机大数组正确', () => {
  const rng = (s: number): (() => number) => {
    let x = s;
    return () => {
      x = (x * 1103515245 + 12345) & 0x7fffffff;
      return x % 1000;
    };
  };
  const r = rng(42);
  const big = Array.from({ length: 200 }, () => r());
  const expected = [...big].sort((a, b) => a - b);
  assert.deepEqual(flashSort(big), expected);
});
