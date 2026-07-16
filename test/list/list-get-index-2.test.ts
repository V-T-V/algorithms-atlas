import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, getAt } from '../../src/algorithms/list/list-get-index-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-get-index-2/trace.ts';
test('getAt 正确', () => {
  assert.equal(getAt(buildList([10, 20, 30, 40]), 2), 30);
  assert.equal(getAt(buildList([10, 20, 30, 40]), 0), 10);
  assert.equal(getAt(buildList([10, 20, 30, 40]), 10), null);
  assert.equal(getAt(null, 0), null);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
