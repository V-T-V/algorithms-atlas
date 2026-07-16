import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, kthFromEnd } from '../../src/algorithms/list/list-kth-from-end-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-kth-from-end-2/trace.ts';
test('kthFromEnd 正确', () => {
  assert.equal(kthFromEnd(buildList([1, 2, 3, 4, 5]), 2), 4);
  assert.equal(kthFromEnd(buildList([1, 2, 3]), 3), 1);
  assert.equal(kthFromEnd(buildList([1]), 1), 1);
  assert.equal(kthFromEnd(buildList([1, 2]), 5), null);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
