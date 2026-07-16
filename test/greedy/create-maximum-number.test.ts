import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createMaximumNumber,
  type CreateMaximumNumberHooks,
} from '../../src/algorithms/greedy/create-maximum-number/impl.ts';

test('create-maximum-number 经典例子 1', () => {
  // LeetCode 示例 1：[9, 8, 6, 5, 3]
  assert.deepEqual(createMaximumNumber([3, 4, 6, 5], [9, 1, 2, 5, 8, 3], 5), [9, 8, 6, 5, 3]);
});

test('create-maximum-number 经典例子 2', () => {
  // LeetCode 示例 2：[6, 7, 6, 0, 4]
  assert.deepEqual(createMaximumNumber([6, 7], [6, 0, 4], 5), [6, 7, 6, 0, 4]);
});

test('create-maximum-number 经典例子 3', () => {
  // LeetCode 示例 3：[9, 8, 9]
  assert.deepEqual(createMaximumNumber([3, 9], [8, 9], 3), [9, 8, 9]);
});

test('create-maximum-number 全来自一个数组', () => {
  assert.deepEqual(createMaximumNumber([1, 2, 3], [], 3), [1, 2, 3]);
  assert.deepEqual(createMaximumNumber([], [5, 6, 7], 3), [5, 6, 7]);
});

test('create-maximum-number k=1 取最大', () => {
  assert.deepEqual(createMaximumNumber([3, 4, 6, 5], [9, 1, 2, 5, 8, 3], 1), [9]);
});

test('create-maximum-number 结果长度恰为 k', () => {
  const r = createMaximumNumber([3, 4, 6, 5], [9, 1, 2, 5, 8, 3], 5);
  assert.equal(r.length, 5);
});

test('create-maximum-number 相同前缀时正确合并', () => {
  // [6,7] 与 [6,0,4]：6==6 时比后续，7>0 → 取 nums1 的 6
  assert.deepEqual(createMaximumNumber([6, 7], [6, 0, 4], 5), [6, 7, 6, 0, 4]);
});

test('create-maximum-number 钩子被调用', () => {
  let splits = 0;
  let concludes = 0;
  const hooks: CreateMaximumNumberHooks = {
    onSplit: () => splits++,
    onConclude: () => concludes++,
  };
  createMaximumNumber([3, 4, 6, 5], [9, 1, 2, 5, 8, 3], 5, hooks);
  assert.ok(splits > 0);
  assert.equal(concludes, 1);
});

test('create-maximum-number 单元素数组', () => {
  assert.deepEqual(createMaximumNumber([1], [2], 2), [2, 1]);
  assert.deepEqual(createMaximumNumber([2], [1], 2), [2, 1]);
});
