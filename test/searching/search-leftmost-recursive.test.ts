import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  binarySearchLeftmostRecursive,
  type LeftRecurHooks,
} from '../../src/algorithms/searching/search-leftmost-recursive/impl.ts';

const A = [1, 3, 3, 3, 5, 7, 9];
test('binarySearchLeftmostRecursive 命中', () => {
  assert.equal(binarySearchLeftmostRecursive(A, 3), 1);
  assert.equal(binarySearchLeftmostRecursive(A, 1), 0);
  assert.equal(binarySearchLeftmostRecursive(A, 9), 6);
});
test('binarySearchLeftmostRecursive 未命中', () => {
  assert.equal(binarySearchLeftmostRecursive(A, 0), -1);
  assert.equal(binarySearchLeftmostRecursive(A, 4), -1);
  assert.equal(binarySearchLeftmostRecursive(A, 10), -1);
});
test('binarySearchLeftmostRecursive 边界', () => {
  assert.equal(binarySearchLeftmostRecursive([], 1), -1);
  assert.equal(binarySearchLeftmostRecursive([5], 5), 0);
});
test('binarySearchLeftmostRecursive 钩子', () => {
  let c = 0;
  binarySearchLeftmostRecursive(A, 3, { onCompare: () => c++ } as LeftRecurHooks);
  assert.ok(c >= 1);
});
