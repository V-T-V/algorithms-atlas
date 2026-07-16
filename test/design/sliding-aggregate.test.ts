import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  slidingSum,
  slidingMax,
  slidingMin,
  slidingAggregate,
} from '../../src/algorithms/design/sliding-aggregate/impl.ts';

test('slidingSum 经典样例', () => {
  assert.deepEqual(slidingSum([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, -1, 1, 5, 14, 16]);
});

test('slidingSum k=1 即自身', () => {
  assert.deepEqual(slidingSum([4, 2, 8, 1], 1), [4, 2, 8, 1]);
});

test('slidingSum k=数组长度', () => {
  assert.deepEqual(slidingSum([1, 2, 3, 4], 4), [10]);
});

test('slidingMax 经典样例', () => {
  assert.deepEqual(slidingMax([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
});

test('slidingMin 经典样例', () => {
  assert.deepEqual(slidingMin([1, 3, -1, -3, 5, 3, 6, 7], 3), [-1, -3, -3, -3, 3, 3]);
});

test('slidingAggregate 分发正确', () => {
  const arr = [2, 5, 1, 4];
  assert.deepEqual(slidingAggregate(arr, 2, 'sum'), [7, 6, 5]);
  assert.deepEqual(slidingAggregate(arr, 2, 'max'), [5, 5, 4]);
  assert.deepEqual(slidingAggregate(arr, 2, 'min'), [2, 1, 1]);
});

test('slidingSum 与朴素法一致', () => {
  const arr = [9, 7, 8, 6, 4, 5, 2, 8, 1, 3];
  const k = 4;
  const naive: number[] = [];
  for (let i = 0; i + k <= arr.length; i++) {
    naive.push(arr.slice(i, i + k).reduce((a, b) => a + b, 0));
  }
  assert.deepEqual(slidingSum(arr, k), naive);
});

test('slidingMax/min 单调递增数组', () => {
  assert.deepEqual(slidingMax([1, 2, 3, 4, 5], 3), [3, 4, 5]);
  assert.deepEqual(slidingMin([1, 2, 3, 4, 5], 3), [1, 2, 3]);
});

test('slidingAggregate 不修改原数组', () => {
  const input = [1, 2, 3];
  slidingSum(input, 2);
  assert.deepEqual(input, [1, 2, 3]);
});

test('slidingAggregate 非法输入抛错', () => {
  assert.throws(() => slidingSum([1, 2, 3], 0));
  assert.throws(() => slidingMax([1, 2, 3], 5));
});
