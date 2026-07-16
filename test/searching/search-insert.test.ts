import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchInsert } from '../../src/algorithms/searching/search-insert/impl.ts';

test('searchInsert 插入位置', () => {
  const a = [1, 3, 5, 6];
  assert.equal(searchInsert(a, 5), 2);
  assert.equal(searchInsert(a, 2), 1);
  assert.equal(searchInsert(a, 7), 4);
  assert.equal(searchInsert(a, 0), 0);
});

test('searchInsert 边界', () => {
  assert.equal(searchInsert([], 1), 0);
  assert.equal(searchInsert([5], 5), 0);
  assert.equal(searchInsert([5], 3), 0);
  assert.equal(searchInsert([5], 9), 1);
});

test('searchInsert 重复', () => {
  assert.equal(searchInsert([1, 2, 2, 2, 3], 2), 1);
});

test('searchInsert 钩子', () => {
  let probes = 0;
  let done = -1;
  searchInsert([1, 3, 5, 6], 5, {
    onProbe: () => probes++,
    onDone: (i) => (done = i),
  });
  assert.ok(probes > 0);
  assert.equal(done, 2);
});
