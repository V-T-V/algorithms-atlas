import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findLength } from '../../src/algorithms/dp/dp-find-length/impl.ts';

test('find-length LeetCode 718 例 1', () => {
  assert.equal(findLength([1, 2, 3, 2, 1], [3, 2, 1, 4, 7]), 3);
});

test('find-length LeetCode 718 例 2', () => {
  assert.equal(findLength([0, 0, 0, 0, 0], [0, 0, 0, 0, 0]), 5);
});

test('find-length 无公共', () => {
  assert.equal(findLength([1, 2, 3], [4, 5, 6]), 0);
});

test('find-length 全等单元素', () => {
  assert.equal(findLength([1], [1]), 1);
});

test('find-length 空数组', () => {
  assert.equal(findLength([], [1, 2]), 0);
});
