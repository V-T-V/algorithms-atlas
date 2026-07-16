import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  heapSortTernary,
  type HeapTernaryHooks,
} from '../../src/algorithms/sorting/sort-heap-ternary/impl.ts';

test('heapSortTernary 基本', () => {
  assert.deepEqual(heapSortTernary([]), []);
  assert.deepEqual(heapSortTernary([1]), [1]);
  assert.deepEqual(heapSortTernary([2, 1]), [1, 2]);
  assert.deepEqual(heapSortTernary([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('heapSortTernary 逆序/重复', () => {
  assert.deepEqual(heapSortTernary([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(heapSortTernary([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('heapSortTernary 钩子', () => {
  let c = 0;
  heapSortTernary([3, 1, 2], { onExtract: () => c++ } as HeapTernaryHooks);
  assert.ok(c >= 1);
});
