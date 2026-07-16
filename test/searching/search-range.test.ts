import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchRange } from '../../src/algorithms/searching/search-range/impl.ts';

test('searchRange 含重复', () => {
  const a = [5, 7, 7, 8, 8, 10];
  assert.deepEqual(searchRange(a, 8), [3, 4]);
  assert.deepEqual(searchRange(a, 7), [1, 2]);
  assert.deepEqual(searchRange(a, 5), [0, 0]);
  assert.deepEqual(searchRange(a, 10), [5, 5]);
  assert.deepEqual(searchRange(a, 6), [-1, -1]);
  assert.deepEqual(searchRange(a, 0), [-1, -1]);
});

test('searchRange 边界', () => {
  assert.deepEqual(searchRange([], 1), [-1, -1]);
  assert.deepEqual(searchRange([5], 5), [0, 0]);
  assert.deepEqual(searchRange([5], 3), [-1, -1]);
});

test('searchRange 钩子', () => {
  let done: [number, number] = [-1, -1];
  searchRange([5, 7, 7, 8, 8, 10], 8, {
    onDone: (f, l) => (done = [f, l]),
  });
  assert.deepEqual(done, [3, 4]);
});
