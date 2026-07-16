import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  countingSortOffset,
  type CountingOffsetHooks,
} from '../../src/algorithms/sorting/sort-counting-offset/impl.ts';

test('countingSortOffset 基本含负数', () => {
  assert.deepEqual(countingSortOffset([]), []);
  assert.deepEqual(countingSortOffset([1]), [1]);
  assert.deepEqual(countingSortOffset([2, 1]), [1, 2]);
  assert.deepEqual(countingSortOffset([-3, 5, -1, 0, 5, 2, -3, 4]), [-3, -3, -1, 0, 2, 4, 5, 5]);
});
test('countingSortOffset 全负/全正', () => {
  assert.deepEqual(countingSortOffset([-5, -1, -3]), [-5, -3, -1]);
  assert.deepEqual(countingSortOffset([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('countingSortOffset 钩子', () => {
  let c = 0;
  countingSortOffset([3, 1, 2], { onCount: () => c++ } as CountingOffsetHooks);
  assert.ok(c >= 1);
});
