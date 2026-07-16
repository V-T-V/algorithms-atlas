import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, countList } from '../../src/algorithms/list/list-count-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-count-2/trace.ts';
test('countList 正确', () => {
  assert.equal(countList(buildList([1, 2, 3, 4, 5])), 5);
  assert.equal(countList(buildList([1])), 1);
  assert.equal(countList(null), 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
