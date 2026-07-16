import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  binarySearchRightmost,
  type BinRightHooks,
} from '../../src/algorithms/searching/search-binary-rightmost/impl.ts';

const A = [1, 3, 3, 3, 5, 7, 9, 11, 11, 13];
test('binarySearchRightmost 命中', () => {
  assert.equal(binarySearchRightmost(A, 3), 3);
  assert.equal(binarySearchRightmost(A, 11), 8);
  assert.equal(binarySearchRightmost(A, 1), 0);
  assert.equal(binarySearchRightmost(A, 13), 9);
});
test('binarySearchRightmost 未命中', () => {
  assert.equal(binarySearchRightmost(A, 0), -1);
  assert.equal(binarySearchRightmost(A, 14), -1);
  assert.equal(binarySearchRightmost(A, 4), -1);
});
test('binarySearchRightmost 边界', () => {
  assert.equal(binarySearchRightmost([], 1), -1);
  assert.equal(binarySearchRightmost([5], 5), 0);
  assert.equal(binarySearchRightmost([5, 5, 5], 5), 2);
});
test('binarySearchRightmost 钩子', () => {
  let c = 0;
  binarySearchRightmost(A, 3, { onCompare: () => c++ } as BinRightHooks);
  assert.ok(c >= 1);
});
