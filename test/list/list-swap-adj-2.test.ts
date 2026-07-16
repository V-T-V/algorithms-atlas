import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  swapPairs,
} from '../../src/algorithms/list/list-swap-adj-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-swap-adj-2/trace.ts';
test('swapPairs 正确', () => {
  assert.deepEqual(listToArray(swapPairs(buildList([1, 2, 3, 4]))), [2, 1, 4, 3]);
  assert.deepEqual(listToArray(swapPairs(buildList([1, 2, 3]))), [2, 1, 3]);
  assert.deepEqual(listToArray(swapPairs(null)), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
