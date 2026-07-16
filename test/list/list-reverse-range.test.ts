import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  reverseRange,
} from '../../src/algorithms/list/list-reverse-range/impl.ts';

test('reverseRange 反转区间', () => {
  assert.deepEqual(listToArray(reverseRange(buildList([1, 2, 3, 4, 5]), 2, 4)), [1, 4, 3, 2, 5]);
  assert.deepEqual(listToArray(reverseRange(buildList([1, 2, 3, 4, 5]), 1, 5)), [5, 4, 3, 2, 1]);
  assert.deepEqual(listToArray(reverseRange(buildList([1, 2, 3]), 2, 2)), [1, 2, 3]);
  assert.deepEqual(listToArray(reverseRange(buildList([5]), 1, 1)), [5]);
});

test('reverseRange 钩子', () => {
  let moves = 0;
  reverseRange(buildList([1, 2, 3, 4]), 1, 4, { onMove: () => moves++ });
  assert.equal(moves, 3);
});
