import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  differenceSorted,
} from '../../src/algorithms/list/list-difference-sorted/impl.ts';

test('differenceSorted 差集', () => {
  assert.deepEqual(
    listToArray(differenceSorted(buildList([1, 2, 3, 5, 7]), buildList([2, 4, 5, 6]))),
    [1, 3, 7],
  );
  assert.deepEqual(listToArray(differenceSorted(buildList([1, 2]), buildList([1, 2, 3]))), []);
  assert.deepEqual(listToArray(differenceSorted(buildList([1, 1, 2]), buildList([2]))), [1]);
});

test('differenceSorted 钩子', () => {
  const kept: number[] = [];
  differenceSorted(buildList([1, 2, 3]), buildList([2]), { onKeep: (v) => kept.push(v) });
  assert.deepEqual(kept, [1, 3]);
});
