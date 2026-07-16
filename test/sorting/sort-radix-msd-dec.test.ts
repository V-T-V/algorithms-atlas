import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  radixSortMsdDec,
  type RadixMsdHooks,
} from '../../src/algorithms/sorting/sort-radix-msd-dec/impl.ts';

test('radixSortMsdDec 基本', () => {
  assert.deepEqual(radixSortMsdDec([]), []);
  assert.deepEqual(radixSortMsdDec([1]), [1]);
  assert.deepEqual(radixSortMsdDec([2, 1]), [1, 2]);
  assert.deepEqual(
    radixSortMsdDec([170, 45, 75, 90, 802, 24, 2, 66]),
    [2, 24, 45, 66, 75, 90, 170, 802],
  );
});
test('radixSortMsdDec 逆序/重复', () => {
  assert.deepEqual(radixSortMsdDec([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(radixSortMsdDec([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('radixSortMsdDec 钩子', () => {
  let c = 0;
  radixSortMsdDec([300, 1, 20], { onDigit: () => c++ } as RadixMsdHooks);
  assert.ok(c >= 1);
});
