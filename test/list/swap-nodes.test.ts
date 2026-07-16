import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, swapNodes } from '../../src/algorithms/list/swap-nodes/impl.ts';

test('swapNodes 两两交换', () => {
  assert.deepEqual(listToArray(swapNodes(buildList([1, 2, 3, 4]))), [2, 1, 4, 3]);
  assert.deepEqual(listToArray(swapNodes(buildList([1, 2, 3]))), [2, 1, 3]);
  assert.deepEqual(listToArray(swapNodes(buildList([1]))), [1]);
  assert.deepEqual(listToArray(swapNodes(buildList([]))), []);
});

test('swapNodes 钩子', () => {
  let swaps = 0;
  swapNodes(buildList([1, 2, 3, 4]), { onSwap: () => swaps++ });
  assert.equal(swaps, 2);
});
