import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  searchRange2,
  type Range2Hooks,
} from '../../src/algorithms/searching/search-range-2/impl.ts';

test('searchRange2 命中', () => {
  assert.deepEqual(searchRange2([5, 7, 7, 8, 8, 10], 8), [3, 4]);
  assert.deepEqual(searchRange2([5, 7, 7, 8, 8, 10], 7), [1, 2]);
  assert.deepEqual(searchRange2([5, 7, 7, 8, 8, 10], 5), [0, 0]);
});
test('searchRange2 未命中', () => {
  assert.deepEqual(searchRange2([5, 7, 7, 8, 8, 10], 6), [-1, -1]);
  assert.deepEqual(searchRange2([], 1), [-1, -1]);
});
test('searchRange2 全相同', () => {
  assert.deepEqual(searchRange2([8, 8, 8, 8], 8), [0, 3]);
});
test('searchRange2 钩子', () => {
  let c = 0;
  searchRange2([5, 7, 7, 8, 8, 10], 8, { onFind: () => c++ } as Range2Hooks);
  assert.ok(c >= 1);
});
