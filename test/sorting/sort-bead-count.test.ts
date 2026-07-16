import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  beadSortCount,
  type BeadCountHooks,
} from '../../src/algorithms/sorting/sort-bead-count/impl.ts';

test('beadSortCount 基本', () => {
  assert.deepEqual(beadSortCount([]), []);
  assert.deepEqual(beadSortCount([0]), [0]);
  assert.deepEqual(beadSortCount([2, 1]), [1, 2]);
  assert.deepEqual(beadSortCount([5, 2, 8, 1, 4, 3]), [1, 2, 3, 4, 5, 8]);
});
test('beadSortCount 重复', () => {
  assert.deepEqual(beadSortCount([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('beadSortCount 钩子', () => {
  let c = 0;
  beadSortCount([3, 1, 2], { onRow: () => c++ } as BeadCountHooks);
  assert.ok(c >= 1);
});
