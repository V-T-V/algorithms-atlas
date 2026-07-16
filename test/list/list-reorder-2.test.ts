import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  reorderList,
} from '../../src/algorithms/list/list-reorder-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-reorder-2/trace.ts';
test('reorderList 正确', () => {
  const h = buildList([1, 2, 3, 4]);
  reorderList(h);
  assert.deepEqual(listToArray(h), [1, 4, 2, 3]);
  const h2 = buildList([1, 2, 3, 4, 5]);
  reorderList(h2);
  assert.deepEqual(listToArray(h2), [1, 5, 2, 4, 3]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
