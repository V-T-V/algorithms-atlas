import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  searchInsert2,
  type Insert2Hooks,
} from '../../src/algorithms/searching/search-insert-2/impl.ts';

test('searchInsert2 命中', () => {
  assert.equal(searchInsert2([1, 3, 5, 6], 5), 2);
  assert.equal(searchInsert2([1, 3, 5, 6], 1), 0);
  assert.equal(searchInsert2([1, 3, 5, 6], 6), 3);
});
test('searchInsert2 插入位置', () => {
  assert.equal(searchInsert2([1, 3, 5, 6], 2), 1);
  assert.equal(searchInsert2([1, 3, 5, 6], 7), 4);
  assert.equal(searchInsert2([1, 3, 5, 6], 0), 0);
});
test('searchInsert2 边界', () => {
  assert.equal(searchInsert2([], 1), 0);
  assert.equal(searchInsert2([5], 5), 0);
  assert.equal(searchInsert2([5], 6), 1);
});
test('searchInsert2 钩子', () => {
  let c = 0;
  searchInsert2([1, 3, 5, 6], 5, { onCompare: () => c++ } as Insert2Hooks);
  assert.ok(c >= 1);
});
