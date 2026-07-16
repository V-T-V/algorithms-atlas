import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shuffleThenSort } from '../../src/algorithms/sorting/sort-shuffle-then-sort/impl.ts';

test('shuffleThenSort 基本排序', () => {
  assert.deepEqual(shuffleThenSort([]), []);
  assert.deepEqual(shuffleThenSort([1]), [1]);
  assert.deepEqual(shuffleThenSort([9, 8, 7, 6, 5, 4, 3, 2, 1]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('shuffleThenSort 重复元素', () => {
  assert.deepEqual(shuffleThenSort([3, 1, 3, 1, 2]), [1, 1, 2, 3, 3]);
});

test('shuffleThenSort 不修改原数组', () => {
  const input = [3, 1, 2];
  shuffleThenSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('shuffleThenSort 确定性随机源可复现', () => {
  let s = 99;
  const rng = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  const r1 = shuffleThenSort([5, 3, 1, 4, 2], rng);
  assert.deepEqual(r1, [1, 2, 3, 4, 5]);
});

test('shuffleThenSort 钩子被调用（洗牌+排序）', () => {
  let shuffles = 0;
  let partitions = 0;
  shuffleThenSort([3, 1, 2], Math.random, {
    onShuffleSwap: () => shuffles++,
    onPartition: () => partitions++,
  });
  assert.ok(shuffles >= 1);
  assert.ok(partitions >= 1);
});
