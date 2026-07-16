import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, splitList, partsToArray } from '../../src/algorithms/list/split-list/impl.ts';

test('splitList 分段', () => {
  assert.deepEqual(partsToArray(splitList(buildList([1, 2, 3]), 5)), [[1], [2], [3], [], []]);
  assert.deepEqual(partsToArray(splitList(buildList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), 3)), [
    [1, 2, 3, 4],
    [5, 6, 7],
    [8, 9, 10],
  ]);
  assert.deepEqual(partsToArray(splitList(buildList([1, 2, 3]), 1)), [[1, 2, 3]]);
  assert.deepEqual(partsToArray(splitList(buildList([]), 3)), [[], [], []]);
});

test('splitList 钩子', () => {
  let parts = 0;
  splitList(buildList([1, 2, 3]), 2, { onPart: () => parts++ });
  assert.equal(parts, 2);
});
