import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  findCeiling,
  type CeilingHooks,
} from '../../src/algorithms/searching/search-ceiling/impl.ts';

const A = [1, 3, 5, 7, 9, 11, 13];
test('findCeiling 命中', () => {
  assert.equal(findCeiling(A, 1), 0);
  assert.equal(findCeiling(A, 13), 6);
  assert.equal(findCeiling(A, 7), 3);
});
test('findCeiling 天花板', () => {
  assert.equal(findCeiling(A, 6), 3);
  assert.equal(findCeiling(A, 0), 0);
  assert.equal(findCeiling(A, 100), -1);
});
test('findCeiling 边界', () => {
  assert.equal(findCeiling([], 1), -1);
  assert.equal(findCeiling([5], 5), 0);
  assert.equal(findCeiling([5], 6), -1);
});
test('findCeiling 钩子', () => {
  let c = 0;
  findCeiling(A, 6, { onCompare: () => c++ } as CeilingHooks);
  assert.ok(c >= 1);
});
