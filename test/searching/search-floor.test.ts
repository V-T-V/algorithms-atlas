import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findFloor, type FloorHooks } from '../../src/algorithms/searching/search-floor/impl.ts';

const A = [1, 3, 5, 7, 9, 11, 13];
test('findFloor 命中', () => {
  assert.equal(findFloor(A, 1), 0);
  assert.equal(findFloor(A, 13), 6);
  assert.equal(findFloor(A, 7), 3);
});
test('findFloor 地板', () => {
  assert.equal(findFloor(A, 6), 2);
  assert.equal(findFloor(A, 0), -1);
  assert.equal(findFloor(A, 100), 6);
});
test('findFloor 边界', () => {
  assert.equal(findFloor([], 1), -1);
  assert.equal(findFloor([5], 5), 0);
  assert.equal(findFloor([5], 3), -1);
});
test('findFloor 钩子', () => {
  let c = 0;
  findFloor(A, 6, { onCompare: () => c++ } as FloorHooks);
  assert.ok(c >= 1);
});
