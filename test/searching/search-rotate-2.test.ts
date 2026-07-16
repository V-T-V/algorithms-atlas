import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  searchRotated2,
  type Rotate2Hooks,
} from '../../src/algorithms/searching/search-rotate-2/impl.ts';

test('searchRotated2 命中', () => {
  assert.equal(searchRotated2([4, 5, 6, 7, 0, 1, 2], 0), 4);
  assert.equal(searchRotated2([4, 5, 6, 7, 0, 1, 2], 3), -1);
  assert.equal(searchRotated2([4, 5, 6, 7, 0, 1, 2], 4), 0);
  assert.equal(searchRotated2([4, 5, 6, 7, 0, 1, 2], 2), 6);
});
test('searchRotated2 未旋转', () => {
  assert.equal(searchRotated2([1, 2, 3, 4, 5], 3), 2);
  assert.equal(searchRotated2([1], 1), 0);
  assert.equal(searchRotated2([1], 0), -1);
});
test('searchRotated2 边界', () => {
  assert.equal(searchRotated2([], 1), -1);
  assert.equal(searchRotated2([3, 1], 1), 1);
});
test('searchRotated2 钩子', () => {
  let c = 0;
  searchRotated2([4, 5, 6, 7, 0, 1, 2], 0, { onCompare: () => c++ } as Rotate2Hooks);
  assert.ok(c >= 1);
});
