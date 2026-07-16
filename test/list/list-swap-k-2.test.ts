import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, swapNodes } from '../../src/algorithms/list/list-swap-k-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-swap-k-2/trace.ts';
test('swapNodes 正确', () => {
  assert.deepEqual(listToArray(swapNodes(buildList([1, 2, 3, 4, 5]), 2)), [1, 4, 3, 2, 5]);
  assert.deepEqual(
    listToArray(swapNodes(buildList([7, 9, 6, 6, 7, 8, 3, 0, 9, 5]), 5)),
    [7, 9, 6, 6, 8, 7, 3, 0, 9, 5],
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
