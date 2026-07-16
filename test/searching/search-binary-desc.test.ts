import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  binarySearchDesc,
  type BinDescHooks,
} from '../../src/algorithms/searching/search-binary-desc/impl.ts';

const A = [21, 19, 17, 15, 13, 11, 9, 7, 5, 3, 1];
test('binarySearchDesc 命中', () => {
  assert.equal(binarySearchDesc(A, 21), 0);
  assert.equal(binarySearchDesc(A, 1), 10);
  assert.equal(binarySearchDesc(A, 9), 6);
});
test('binarySearchDesc 未命中', () => {
  assert.equal(binarySearchDesc(A, 22), -1);
  assert.equal(binarySearchDesc(A, 0), -1);
  assert.equal(binarySearchDesc(A, 8), -1);
});
test('binarySearchDesc 边界', () => {
  assert.equal(binarySearchDesc([], 1), -1);
  assert.equal(binarySearchDesc([5], 5), 0);
  assert.equal(binarySearchDesc([5], 3), -1);
});
test('binarySearchDesc 钩子', () => {
  let c = 0;
  binarySearchDesc(A, 9, { onCompare: () => c++ } as BinDescHooks);
  assert.ok(c >= 1);
});
