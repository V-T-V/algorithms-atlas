import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listMax } from '../../src/algorithms/list/list-max-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-max-2/trace.ts';
test('listMax 正确', () => {
  assert.equal(listMax(buildList([3, 7, 2, 9, 5])), 9);
  assert.equal(listMax(buildList([1])), 1);
  assert.equal(listMax(null), null);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
