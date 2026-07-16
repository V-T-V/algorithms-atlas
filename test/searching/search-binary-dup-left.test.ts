import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  lowerBound,
  binarySearchLeftmost,
} from '../../src/algorithms/searching/search-binary-dup-left/impl.ts';

test('重复元素返回最左', () => {
  const arr = [1, 3, 3, 3, 5, 7, 7, 7, 7, 9];
  assert.equal(binarySearchLeftmost(arr, 3), 1);
  assert.equal(binarySearchLeftmost(arr, 7), 5);
});

test('单次元素', () => {
  const arr = [1, 3, 5, 7, 9];
  assert.equal(binarySearchLeftmost(arr, 5), 2);
});

test('不存在返回 -1', () => {
  const arr = [1, 3, 5, 7, 9];
  assert.equal(binarySearchLeftmost(arr, 4), -1);
  assert.equal(binarySearchLeftmost(arr, 10), -1);
});

test('lowerBound 返回插入位置', () => {
  const arr = [1, 3, 5, 7, 9];
  assert.equal(lowerBound(arr, 4), 2);
  assert.equal(lowerBound(arr, 0), 0);
  assert.equal(lowerBound(arr, 10), 5);
});

test('空数组', () => {
  assert.equal(binarySearchLeftmost([], 5), -1);
  assert.equal(lowerBound([], 5), 0);
});

test('全相同元素', () => {
  const arr = [5, 5, 5, 5, 5];
  assert.equal(binarySearchLeftmost(arr, 5), 0);
  assert.equal(lowerBound(arr, 5), 0);
});
