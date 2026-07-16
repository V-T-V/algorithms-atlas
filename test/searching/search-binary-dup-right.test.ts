import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  upperBound,
  binarySearchRightmost,
} from '../../src/algorithms/searching/search-binary-dup-right/impl.ts';

test('重复元素返回最右', () => {
  const arr = [1, 3, 3, 3, 5, 7, 7, 7, 7, 9];
  assert.equal(binarySearchRightmost(arr, 3), 3);
  assert.equal(binarySearchRightmost(arr, 7), 8);
});

test('单次元素', () => {
  const arr = [1, 3, 5, 7, 9];
  assert.equal(binarySearchRightmost(arr, 5), 2);
});

test('不存在返回 -1', () => {
  const arr = [1, 3, 5, 7, 9];
  assert.equal(binarySearchRightmost(arr, 4), -1);
  assert.equal(binarySearchRightmost(arr, 10), -1);
});

test('upperBound 返回第一个 > target 的位置', () => {
  const arr = [1, 3, 5, 7, 9];
  assert.equal(upperBound(arr, 5), 3);
  assert.equal(upperBound(arr, 9), 5);
  assert.equal(upperBound(arr, 0), 0);
});

test('空数组', () => {
  assert.equal(binarySearchRightmost([], 5), -1);
  assert.equal(upperBound([], 5), 0);
});

test('全相同元素', () => {
  const arr = [5, 5, 5, 5, 5];
  assert.equal(binarySearchRightmost(arr, 5), 4);
  assert.equal(upperBound(arr, 5), 5);
});
