import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  kthSmallest,
  type KthHooks,
} from '../../src/algorithms/searching/search-kth-smallest/impl.ts';

test('kthSmallest 基本', () => {
  assert.equal(kthSmallest([7, 10, 4, 3, 20, 15], 3), 7);
  assert.equal(kthSmallest([7, 10, 4, 3, 20, 15], 1), 3);
  assert.equal(kthSmallest([7, 10, 4, 3, 20, 15], 6), 20);
});
test('kthSmallest 边界', () => {
  assert.equal(kthSmallest([5], 1), 5);
  assert.throws(() => kthSmallest([1, 2], 3));
  assert.throws(() => kthSmallest([1, 2], 0));
});
test('kthSmallest 钩子', () => {
  let c = 0;
  kthSmallest([7, 10, 4], 2, { onPick: () => c++ } as KthHooks);
  assert.ok(c >= 1);
});
