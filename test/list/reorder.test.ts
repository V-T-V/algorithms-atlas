import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, reorder } from '../../src/algorithms/list/reorder/impl.ts';

test('reorder 重排', () => {
  assert.deepEqual(listToArray(reorder(buildList([1, 2, 3, 4]))), [1, 4, 2, 3]);
  assert.deepEqual(listToArray(reorder(buildList([1, 2, 3, 4, 5]))), [1, 5, 2, 4, 3]);
  assert.deepEqual(listToArray(reorder(buildList([1]))), [1]);
  assert.deepEqual(listToArray(reorder(buildList([]))), []);
});

test('reorder 钩子', () => {
  let merges = 0;
  reorder(buildList([1, 2, 3, 4]), { onMerge: () => merges++ });
  assert.ok(merges > 0);
});
