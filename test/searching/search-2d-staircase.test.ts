import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  staircaseSearch2D,
  type StaircaseHooks,
} from '../../src/algorithms/searching/search-2d-staircase/impl.ts';

const M = [
  [1, 4, 7, 11],
  [2, 5, 8, 12],
  [3, 6, 9, 16],
  [10, 13, 14, 17],
];
test('staircaseSearch2D 命中', () => {
  assert.deepEqual(staircaseSearch2D(M, 5), [1, 1]);
  assert.deepEqual(staircaseSearch2D(M, 11), [0, 3]);
  assert.deepEqual(staircaseSearch2D(M, 17), [3, 3]);
});
test('staircaseSearch2D 未命中', () => {
  assert.deepEqual(staircaseSearch2D(M, 100), [-1, -1]);
  assert.deepEqual(staircaseSearch2D(M, 15), [-1, -1]);
});
test('staircaseSearch2D 边界', () => {
  assert.deepEqual(staircaseSearch2D([], 1), [-1, -1]);
  assert.deepEqual(staircaseSearch2D([[5]], 5), [0, 0]);
});
test('staircaseSearch2D 钩子', () => {
  let c = 0;
  staircaseSearch2D(M, 5, { onStep: () => c++ } as StaircaseHooks);
  assert.ok(c >= 1);
});
