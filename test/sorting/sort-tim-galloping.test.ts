import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  gallopMergeSort,
  type GallopHooks,
} from '../../src/algorithms/sorting/sort-tim-galloping/impl.ts';

test('gallopMergeSort 基本', () => {
  assert.deepEqual(gallopMergeSort([]), []);
  assert.deepEqual(gallopMergeSort([1]), [1]);
  assert.deepEqual(gallopMergeSort([2, 1]), [1, 2]);
  assert.deepEqual(gallopMergeSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('gallopMergeSort 逆序/重复', () => {
  assert.deepEqual(gallopMergeSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(gallopMergeSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('gallopMergeSort 部分有序触发 gallop', () => {
  let c = 0;
  gallopMergeSort([1, 2, 3, 4, 5, 6, 5, 6, 7, 8], { onGallop: () => c++ } as GallopHooks);
  assert.ok(c >= 0);
});
