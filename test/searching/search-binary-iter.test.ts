import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  binarySearchIter,
  type BinIterHooks,
} from '../../src/algorithms/searching/search-binary-iter/impl.ts';

const ARR = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

test('search-binary-iter 命中', () => {
  assert.equal(binarySearchIter(ARR, 1), 0);
  assert.equal(binarySearchIter(ARR, 21), 10);
  assert.equal(binarySearchIter(ARR, 15), 7);
  assert.equal(binarySearchIter(ARR, 11), 5);
});
test('search-binary-iter 未命中', () => {
  assert.equal(binarySearchIter(ARR, 0), -1);
  assert.equal(binarySearchIter(ARR, 22), -1);
  assert.equal(binarySearchIter(ARR, 8), -1);
});
test('search-binary-iter 边界', () => {
  assert.equal(binarySearchIter([], 1), -1);
  assert.equal(binarySearchIter([5], 5), 0);
  assert.equal(binarySearchIter([5], 3), -1);
});
test('search-binary-iter 钩子', () => {
  let c = 0;
  binarySearchIter(ARR, 15, { onCompare: () => c++ } as BinIterHooks);
  assert.ok(c >= 1);
});
