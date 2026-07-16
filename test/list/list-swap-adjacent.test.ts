import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  swapAdjacent,
} from '../../src/algorithms/list/list-swap-adjacent/impl.ts';

test('swapAdjacent 两两交换', () => {
  assert.deepEqual(listToArray(swapAdjacent(buildList([1, 2, 3, 4]))), [2, 1, 4, 3]);
  assert.deepEqual(listToArray(swapAdjacent(buildList([1, 2, 3, 4, 5]))), [2, 1, 4, 3, 5]);
  assert.deepEqual(listToArray(swapAdjacent(buildList([1]))), [1]);
  assert.deepEqual(listToArray(swapAdjacent(buildList([1, 2]))), [2, 1]);
  assert.deepEqual(listToArray(swapAdjacent(buildList([]))), []);
});

test('swapAdjacent 钩子', () => {
  let swaps = 0;
  swapAdjacent(buildList([1, 2, 3, 4]), { onSwap: () => swaps++ });
  assert.equal(swaps, 2);
});
