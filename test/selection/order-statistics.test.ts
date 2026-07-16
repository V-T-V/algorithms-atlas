import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  quickselect,
  orderStatistics,
} from '../../src/algorithms/selection/order-statistics/impl.ts';

test('quickselect 第 k 小正确', () => {
  const arr = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  const sorted = [...arr].sort((a, b) => a - b);
  for (let k = 0; k < arr.length; k++) {
    assert.equal(quickselect(arr, k), sorted[k], `k=${k}`);
  }
});

test('quickselect 最小/最大/中位数', () => {
  const arr = [3, 1, 4, 1, 5, 9, 2, 6];
  assert.equal(quickselect(arr, 0), 1); // 最小
  assert.equal(quickselect(arr, arr.length - 1), 9); // 最大
  assert.equal(quickselect([5, 2, 8, 1, 9, 3, 7, 4, 6], 4), 5); // 中位数（0-based 第 4 小）
});

test('quickselect 与排序一致（随机数组）', () => {
  for (let trial = 0; trial < 50; trial++) {
    const n = 20 + (trial % 30);
    const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 1000));
    const sorted = [...arr].sort((a, b) => a - b);
    for (const k of [0, 1, Math.floor(n / 2), n - 2, n - 1]) {
      assert.equal(quickselect(arr, k), sorted[k], `trial=${trial} k=${k}`);
    }
  }
});

test('quickselect 不修改原数组', () => {
  const input = [5, 2, 8, 1, 9];
  const snap = [...input];
  quickselect(input, 2);
  assert.deepEqual(input, snap);
});

test('quickselect 单元素', () => {
  assert.equal(quickselect([42], 0), 42);
});

test('quickselect 拒绝越界 k', () => {
  assert.throws(() => quickselect([1, 2, 3], -1), RangeError);
  assert.throws(() => quickselect([1, 2, 3], 3), RangeError);
  assert.throws(() => quickselect([1, 2, 3], 1.5), RangeError);
});

test('orderStatistics 是 quickselect 的别名', () => {
  const arr = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  assert.equal(orderStatistics(arr, 0), quickselect(arr, 0));
  assert.equal(orderStatistics(arr, 4), quickselect(arr, 4));
});

test('quickselect 钩子被调用', () => {
  let partitions = 0;
  let compares = 0;
  let swaps = 0;
  let pins = 0;
  let pinnedIdx = -1;
  const v = quickselect([5, 2, 8, 1, 9, 3, 7, 4, 6], 4, {
    onPartition: () => partitions++,
    onCompare: () => compares++,
    onSwap: () => swaps++,
    onPinned: (i) => {
      pins++;
      pinnedIdx = i;
    },
  });
  assert.equal(v, 5);
  assert.ok(partitions >= 1);
  assert.ok(compares >= 1);
  assert.equal(pins, 1);
  assert.ok(pinnedIdx >= 0);
});
