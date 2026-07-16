import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, findMiddle } from '../../src/algorithms/list/list-mid-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-mid-2/trace.ts';
test('findMiddle 正确', () => {
  assert.equal(findMiddle(buildList([1, 2, 3, 4, 5]))!.value, 3);
  assert.equal(findMiddle(buildList([1, 2, 3, 4]))!.value, 3);
  assert.equal(findMiddle(buildList([1]))!.value, 1);
  assert.equal(findMiddle(null), null);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
