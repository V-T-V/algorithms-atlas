import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  deleteDuplicates2,
} from '../../src/algorithms/list/delete-duplicates-2/impl.ts';

test('deleteDuplicates2 只留唯一', () => {
  assert.deepEqual(listToArray(deleteDuplicates2(buildList([1, 2, 3, 3, 4, 4, 5]))), [1, 2, 5]);
  assert.deepEqual(listToArray(deleteDuplicates2(buildList([1, 1, 1, 2, 3]))), [2, 3]);
  assert.deepEqual(listToArray(deleteDuplicates2(buildList([1, 1]))), []);
  assert.deepEqual(listToArray(deleteDuplicates2(buildList([]))), []);
  assert.deepEqual(listToArray(deleteDuplicates2(buildList([1, 2, 3]))), [1, 2, 3]);
});

test('deleteDuplicates2 钩子', () => {
  let ranges = 0;
  deleteDuplicates2(buildList([1, 1, 2]), {
    onDeleteRange: () => ranges++,
  });
  assert.equal(ranges, 1);
});
