import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  lowerBound,
  type LowerBoundHooks,
} from '../../src/algorithms/searching/search-lower-bound/impl.ts';

const A = [1, 3, 3, 5, 7, 9, 11, 13];
test('lowerBound 命中', () => {
  assert.equal(lowerBound(A, 1), 0);
  assert.equal(lowerBound(A, 5), 3);
  assert.equal(lowerBound(A, 13), 7);
});
test('lowerBound 插入位置', () => {
  assert.equal(lowerBound(A, 0), 0);
  assert.equal(lowerBound(A, 14), 8);
  assert.equal(lowerBound(A, 6), 4);
  assert.equal(lowerBound(A, 3), 1);
});
test('lowerBound 边界', () => {
  assert.equal(lowerBound([], 1), 0);
  assert.equal(lowerBound([5], 5), 0);
  assert.equal(lowerBound([5], 6), 1);
});
test('lowerBound 钩子', () => {
  let c = 0;
  lowerBound(A, 6, { onCompare: () => c++ } as LowerBoundHooks);
  assert.ok(c >= 1);
});
