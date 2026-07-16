import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lisLength } from '../../src/algorithms/dp/dp-lis-4/impl.ts';

test('lis-length LeetCode 300 例', () => {
  assert.equal(lisLength([10, 9, 2, 5, 3, 7, 101, 18]), 4);
});

test('lis-length 单调上升', () => {
  assert.equal(lisLength([1, 2, 3, 4, 5]), 5);
});

test('lis-length 单调下降', () => {
  assert.equal(lisLength([5, 4, 3, 2, 1]), 1);
});

test('lis-length 空数组', () => {
  assert.equal(lisLength([]), 0);
});

test('lis-length 单元素', () => {
  assert.equal(lisLength([7]), 1);
});
