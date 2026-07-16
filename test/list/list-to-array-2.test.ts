import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, toArray } from '../../src/algorithms/list/list-to-array-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-to-array-2/trace.ts';
test('toArray 正确', () => {
  assert.deepEqual(toArray(buildList([5, 4, 3, 2, 1])), [5, 4, 3, 2, 1]);
  assert.deepEqual(toArray(null), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
