import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchRotate } from '../../src/algorithms/searching/search-rotate/impl.ts';

test('searchRotate 命中与未命中', () => {
  const a = [4, 5, 6, 7, 0, 1, 2];
  assert.equal(searchRotate(a, 0), 4);
  assert.equal(searchRotate(a, 3), -1);
  assert.equal(searchRotate(a, 4), 0);
  assert.equal(searchRotate(a, 2), 6);
  assert.equal(searchRotate([1], 0), -1);
});

test('searchRotate 未旋转', () => {
  assert.equal(searchRotate([1, 2, 3, 4, 5], 3), 2);
  assert.equal(searchRotate([1, 2, 3, 4, 5], 6), -1);
});

test('searchRotate 边界', () => {
  assert.equal(searchRotate([], 1), -1);
  assert.equal(searchRotate([5], 5), 0);
});

test('searchRotate 钩子', () => {
  let done = -1;
  searchRotate([4, 5, 6, 7, 0, 1, 2], 0, { onDone: (i) => (done = i) });
  assert.equal(done, 4);
});
