import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  intersectSorted,
  type IntersectHooks,
} from '../../src/algorithms/searching/search-intersect-sorted/impl.ts';

test('intersectSorted 基本', () => {
  assert.deepEqual(intersectSorted([1, 2, 2, 3, 4, 6], [2, 3, 5, 6]), [2, 3, 6]);
  assert.deepEqual(intersectSorted([1, 2, 3], [4, 5, 6]), []);
  assert.deepEqual(intersectSorted([], [1, 2]), []);
});
test('intersectSorted 全交集', () => {
  assert.deepEqual(intersectSorted([1, 2, 3], [1, 2, 3]), [1, 2, 3]);
});
test('intersectSorted 钩子', () => {
  let c = 0;
  intersectSorted([1, 2], [2, 3], { onCompare: () => c++ } as IntersectHooks);
  assert.ok(c >= 1);
});
