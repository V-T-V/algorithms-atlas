import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FenwickTree, fenwickTree } from '../../src/algorithms/ds/fenwick-tree/impl.ts';

// 暴力求和，用于交叉验证
function brutePrefix(arr: number[], idx: number): number {
  let s = 0;
  for (let i = 0; i < Math.min(idx, arr.length); i++) s += arr[i]!;
  return s;
}

test('fenwick-tree 建树与前缀和', () => {
  const arr = [2, 1, 5, 3, 4];
  const ft = fenwickTree(arr);
  assert.equal(ft.prefixSum(1), 2);
  assert.equal(ft.prefixSum(2), 3);
  assert.equal(ft.prefixSum(3), 8);
  assert.equal(ft.prefixSum(4), 11);
  assert.equal(ft.prefixSum(5), 15);
  assert.equal(ft.prefixSum(0), 0);
});

test('fenwick-tree 前缀和与暴力一致（随机）', () => {
  const arr = [3, 7, 1, 8, 2, 9, 4, 6, 5];
  const ft = fenwickTree(arr);
  for (let idx = 0; idx <= arr.length; idx++) {
    assert.equal(ft.prefixSum(idx), brutePrefix(arr, idx), `prefixSum(${idx}) mismatch`);
  }
});

test('fenwick-tree 区间和', () => {
  const arr = [2, 1, 5, 3, 4];
  const ft = fenwickTree(arr);
  assert.equal(ft.rangeSum(1, 5), 15);
  assert.equal(ft.rangeSum(2, 4), 1 + 5 + 3);
  assert.equal(ft.rangeSum(3, 3), 5);
  assert.equal(ft.rangeSum(4, 2), 0); // l > r
});

test('fenwick-tree 单点加', () => {
  const ft = fenwickTree([2, 1, 5, 3, 4]);
  ft.add(3, 3); // 第 3 个 +3
  assert.equal(ft.prefixSum(3), 11); // 2+1+8
  assert.equal(ft.rangeSum(3, 3), 8);
  assert.equal(ft.prefixSum(5), 18);
  ft.add(1, -2); // 第 1 个 -2
  assert.equal(ft.prefixSum(5), 16);
  assert.equal(ft.rangeSum(1, 1), 0);
});

test('fenwick-tree 边界：空 / 单元素', () => {
  const empty = fenwickTree([]);
  assert.equal(empty.prefixSum(0), 0);
  assert.equal(empty.rangeSum(1, 1), 0);

  const one = fenwickTree([42]);
  assert.equal(one.prefixSum(1), 42);
  assert.equal(one.rangeSum(1, 1), 42);
  one.add(1, 8);
  assert.equal(one.prefixSum(1), 50);
});

test('fenwick-tree 越界处理', () => {
  const ft = fenwickTree([1, 2, 3]);
  // 越界 add 应被忽略
  ft.add(0, 10);
  ft.add(4, 10);
  assert.equal(ft.prefixSum(3), 6);
  // 越界 prefixSum 按边界处理
  assert.equal(ft.prefixSum(100), 6);
  assert.equal(ft.prefixSum(-5), 0);
});

test('fenwick-tree 连续更新后仍正确', () => {
  const arr = [1, 2, 3, 4, 5];
  const ft = fenwickTree(arr);
  for (let i = 1; i <= arr.length; i++) ft.add(i, arr[i - 1]!);
  for (let idx = 1; idx <= arr.length; idx++) {
    assert.equal(
      ft.prefixSum(idx),
      brutePrefix(
        arr.map((v) => v * 2),
        idx,
      ),
    );
  }
});

test('fenwick-tree 钩子被调用', () => {
  let updates = 0;
  let queries = 0;
  const ft = new FenwickTree(5);
  ft.add(1, 5, { onUpdateStep: () => updates++ });
  ft.prefixSum(1, { onQueryStep: () => queries++ });
  assert.ok(updates > 0, 'add 应触发更新回调');
  assert.ok(queries > 0, 'prefixSum 应触发查询回调');
});

test('fenwick-tree fromArray 静态构造', () => {
  const ft = FenwickTree.fromArray([10, 20, 30]);
  assert.equal(ft.prefixSum(1), 10);
  assert.equal(ft.prefixSum(2), 30);
  assert.equal(ft.prefixSum(3), 60);
});

test('fenwick-tree 负数增量', () => {
  const ft = fenwickTree([5, 5, 5]);
  ft.add(2, -3);
  assert.equal(ft.prefixSum(2), 7); // 5 + 2
  assert.equal(ft.rangeSum(2, 2), 2);
});
