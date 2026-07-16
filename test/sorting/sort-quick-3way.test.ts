import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  quickSort3Way,
  type Quick3WayHooks,
} from '../../src/algorithms/sorting/sort-quick-3way/impl.ts';

test('quickSort3Way 基本', () => {
  assert.deepEqual(quickSort3Way([]), []);
  assert.deepEqual(quickSort3Way([1]), [1]);
  assert.deepEqual(quickSort3Way([2, 1]), [1, 2]);
  assert.deepEqual(quickSort3Way([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('quickSort3Way 大量重复', () => {
  assert.deepEqual(quickSort3Way([3, 3, 1, 3, 2, 3, 1]), [1, 1, 2, 3, 3, 3, 3]);
  assert.deepEqual(quickSort3Way([5, 5, 5, 5]), [5, 5, 5, 5]);
});
test('quickSort3Way 不修改原数组', () => {
  const input = [3, 1, 2];
  quickSort3Way(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('quickSort3Way 钩子', () => {
  let c = 0;
  quickSort3Way([3, 1, 2, 3], { onPartition: () => c++ } as Quick3WayHooks);
  assert.ok(c >= 1);
});
