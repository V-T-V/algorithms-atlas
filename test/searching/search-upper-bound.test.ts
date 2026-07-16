import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  upperBound,
  type UpperBoundHooks,
} from '../../src/algorithms/searching/search-upper-bound/impl.ts';

const A = [1, 3, 3, 5, 7, 9, 11, 13];
test('upperBound 命中', () => {
  assert.equal(upperBound(A, 3), 3);
  assert.equal(upperBound(A, 1), 1);
  assert.equal(upperBound(A, 13), 8);
});
test('upperBound 插入位置', () => {
  assert.equal(upperBound(A, 0), 0);
  assert.equal(upperBound(A, 14), 8);
  assert.equal(upperBound(A, 6), 4);
});
test('upperBound 边界', () => {
  assert.equal(upperBound([], 1), 0);
  assert.equal(upperBound([5], 5), 1);
  assert.equal(upperBound([5], 4), 0);
});
test('upperBound 钩子', () => {
  let c = 0;
  upperBound(A, 3, { onCompare: () => c++ } as UpperBoundHooks);
  assert.ok(c >= 1);
});
