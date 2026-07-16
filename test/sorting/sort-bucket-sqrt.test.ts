import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bucketSortSqrt,
  type BucketSqrtHooks,
} from '../../src/algorithms/sorting/sort-bucket-sqrt/impl.ts';

test('bucketSortSqrt 基本', () => {
  assert.deepEqual(bucketSortSqrt([]), []);
  assert.deepEqual(bucketSortSqrt([1]), [1]);
  assert.deepEqual(bucketSortSqrt([2, 1]), [1, 2]);
  assert.deepEqual(
    bucketSortSqrt([29, 10, 14, 37, 13, 25, 41, 8, 22, 30]),
    [8, 10, 13, 14, 22, 25, 29, 30, 37, 41],
  );
});
test('bucketSortSqrt 逆序/重复', () => {
  assert.deepEqual(bucketSortSqrt([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(bucketSortSqrt([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('bucketSortSqrt 钩子', () => {
  let c = 0;
  bucketSortSqrt([3, 1, 2], { onBucket: () => c++ } as BucketSqrtHooks);
  assert.ok(c >= 1);
});
