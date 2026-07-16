import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  mergeSortedAlt,
} from '../../src/algorithms/list/list-merge-sorted-alt/impl.ts';

test('mergeSortedAlt 合并', () => {
  assert.deepEqual(
    listToArray(mergeSortedAlt(buildList([1, 2, 4]), buildList([1, 3, 4]))),
    [1, 1, 2, 3, 4, 4],
  );
  assert.deepEqual(listToArray(mergeSortedAlt(buildList([]), buildList([0]))), [0]);
  assert.deepEqual(listToArray(mergeSortedAlt(buildList([1]), buildList([]))), [1]);
  assert.deepEqual(listToArray(mergeSortedAlt(buildList([]), buildList([]))), []);
});

test('mergeSortedAlt 钩子被调用', () => {
  const picks: number[] = [];
  mergeSortedAlt(buildList([1, 3]), buildList([2]), { onPick: (v) => picks.push(v) });
  assert.deepEqual(picks, [1, 2, 3]);
});
