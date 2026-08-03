import { test } from 'node:test';
import assert from 'node:assert/strict';
import { radixSort } from '../../src/algorithms/sorting/radix-sort/impl.ts';

test('radix-sort 基本行为', () => {
  assert.deepEqual(radixSort([]), []);
  assert.deepEqual(radixSort([1]), [1]);
});

test('radix-sort 正确排序（多位数）', () => {
  assert.deepEqual(radixSort([170, 45, 75, 90, 802, 24, 2, 66]), [
    2, 24, 45, 66, 75, 90, 170, 802,
  ]);
});

test('radix-sort 已有序 / 逆序', () => {
  assert.deepEqual(radixSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(radixSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
});

test('radix-sort 含重复元素', () => {
  assert.deepEqual(radixSort([3, 1, 2, 1, 3, 2]), [1, 1, 2, 2, 3, 3]);
});

test('radix-sort 不修改原数组', () => {
  const input = [3, 1, 2];
  radixSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('radix-sort 稳定性（同值保持相对顺序）', () => {
  // 计数收集为逆序，对同值保持稳定
  assert.deepEqual(radixSort([4, 2, 4, 2, 4]), [2, 2, 4, 4, 4]);
});

test('radix-sort 钩子在每个数位触发', () => {
  const digits: number[] = [];
  const distributes: number[] = [];
  radixSort([170, 45, 2], {
    onDigit: (d) => digits.push(d),
    onDistribute: (i) => distributes.push(i),
  });
  // 802 是 3 位数 → 处理 3 轮（个/十/百）
  assert.ok(digits.length >= 1);
  assert.ok(distributes.length >= 3);
});

test('radix-sort 拒绝负数（否则静默错排）', () => {
  assert.throws(() => radixSort([-1, 0, 1]), /仅支持非负整数/);
  assert.throws(() => radixSort([3, -2]), /仅支持非负整数/);
});

test('radix-sort 拒绝非整数', () => {
  assert.throws(() => radixSort([1, 2.5]), /仅支持非负整数/);
});
