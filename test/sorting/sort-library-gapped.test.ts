import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  librarySortGapped,
  type LibraryGappedHooks,
} from '../../src/algorithms/sorting/sort-library-gapped/impl.ts';

test('librarySortGapped 基本', () => {
  assert.deepEqual(librarySortGapped([]), []);
  assert.deepEqual(librarySortGapped([1]), [1]);
  assert.deepEqual(librarySortGapped([2, 1]), [1, 2]);
  assert.deepEqual(librarySortGapped([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('librarySortGapped 逆序/重复', () => {
  assert.deepEqual(librarySortGapped([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(librarySortGapped([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('librarySortGapped 钩子', () => {
  let c = 0;
  librarySortGapped([3, 1, 2], { onInsert: () => c++ } as LibraryGappedHooks);
  assert.ok(c >= 1);
});
