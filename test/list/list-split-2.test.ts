import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  splitByValue,
} from '../../src/algorithms/list/list-split-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-split-2/trace.ts';
test('splitByValue 正确', () => {
  const [a, b] = splitByValue(buildList([4, 1, 3, 2, 5]), 3);
  assert.deepEqual(listToArray(a), [1, 2]);
  assert.deepEqual(listToArray(b), [4, 3, 5]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
