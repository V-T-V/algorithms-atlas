import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  listBubbleSort,
} from '../../src/algorithms/list/list-sort-bubble/impl.ts';

test('listBubbleSort 排序', () => {
  assert.deepEqual(listToArray(listBubbleSort(buildList([4, 2, 1, 3]))), [1, 2, 3, 4]);
  assert.deepEqual(listToArray(listBubbleSort(buildList([5, 4, 3, 2, 1]))), [1, 2, 3, 4, 5]);
  assert.deepEqual(listToArray(listBubbleSort(buildList([1]))), [1]);
  assert.deepEqual(listToArray(listBubbleSort(buildList([]))), []);
});

test('listBubbleSort 钩子', () => {
  let swaps = 0;
  listBubbleSort(buildList([3, 2, 1]), { onSwap: () => swaps++ });
  assert.ok(swaps >= 2);
});
