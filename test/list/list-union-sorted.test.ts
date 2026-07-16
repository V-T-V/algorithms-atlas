import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  unionSorted,
} from '../../src/algorithms/list/list-union-sorted/impl.ts';

test('unionSorted 并集', () => {
  assert.deepEqual(
    listToArray(unionSorted(buildList([1, 2, 3, 5]), buildList([2, 4, 5, 6]))),
    [1, 2, 3, 4, 5, 6],
  );
  assert.deepEqual(listToArray(unionSorted(buildList([]), buildList([1, 2]))), [1, 2]);
  assert.deepEqual(listToArray(unionSorted(buildList([1, 1, 2]), buildList([1, 2, 2]))), [1, 2]);
});

test('unionSorted 钩子', () => {
  const acc: number[] = [];
  unionSorted(buildList([1, 3]), buildList([2]), { onAppend: (v) => acc.push(v) });
  assert.deepEqual(acc, [1, 2, 3]);
});
