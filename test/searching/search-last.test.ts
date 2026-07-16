import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchLast } from '../../src/algorithms/searching/search-last/impl.ts';

test('searchLast 含重复', () => {
  const a = [1, 2, 2, 2, 3, 3, 4];
  assert.equal(searchLast(a, 2), 3);
  assert.equal(searchLast(a, 3), 5);
  assert.equal(searchLast(a, 1), 0);
  assert.equal(searchLast(a, 4), 6);
  assert.equal(searchLast(a, 5), -1);
});

test('searchLast 边界', () => {
  assert.equal(searchLast([], 1), -1);
  assert.equal(searchLast([5], 5), 0);
  assert.equal(searchLast([5], 3), -1);
});

test('searchLast 钩子', () => {
  let done = -1;
  searchLast([1, 2, 2, 3], 2, { onDone: (i) => (done = i) });
  assert.equal(done, 2);
});
