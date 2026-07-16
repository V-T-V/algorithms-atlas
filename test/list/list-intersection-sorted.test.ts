import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  intersectionSorted,
} from '../../src/algorithms/list/list-intersection-sorted/impl.ts';

test('intersectionSorted 交集', () => {
  assert.deepEqual(
    listToArray(intersectionSorted(buildList([1, 2, 3, 5, 6]), buildList([2, 4, 5, 6, 7]))),
    [2, 5, 6],
  );
  assert.deepEqual(listToArray(intersectionSorted(buildList([1, 2]), buildList([3, 4]))), []);
  assert.deepEqual(
    listToArray(intersectionSorted(buildList([1, 1, 2]), buildList([1, 1, 3]))),
    [1],
  );
});

test('intersectionSorted 钩子', () => {
  const matches: number[] = [];
  intersectionSorted(buildList([1, 2, 3]), buildList([2, 3, 4]), {
    onMatch: (v) => matches.push(v),
  });
  assert.deepEqual(matches, [2, 3]);
});
