import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  deleteDuplicates,
} from '../../src/algorithms/list/delete-duplicates/impl.ts';

test('deleteDuplicates 去重', () => {
  assert.deepEqual(listToArray(deleteDuplicates(buildList([1, 1, 2]))), [1, 2]);
  assert.deepEqual(listToArray(deleteDuplicates(buildList([1, 1, 2, 3, 3]))), [1, 2, 3]);
  assert.deepEqual(listToArray(deleteDuplicates(buildList([1, 1, 1, 1]))), [1]);
  assert.deepEqual(listToArray(deleteDuplicates(buildList([]))), []);
  assert.deepEqual(listToArray(deleteDuplicates(buildList([5]))), [5]);
});

test('deleteDuplicates 钩子', () => {
  let compares = 0;
  let done = false;
  deleteDuplicates(buildList([1, 1, 2]), {
    onCompare: () => compares++,
    onDone: () => (done = true),
  });
  assert.ok(compares > 0);
  assert.equal(done, true);
});
