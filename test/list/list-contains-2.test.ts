import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, containsValue } from '../../src/algorithms/list/list-contains-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-contains-2/trace.ts';
test('containsValue 正确', () => {
  assert.equal(containsValue(buildList([4, 2, 7, 1, 9]), 7), true);
  assert.equal(containsValue(buildList([4, 2, 7, 1, 9]), 8), false);
  assert.equal(containsValue(null, 1), false);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
