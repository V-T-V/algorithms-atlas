import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listSum } from '../../src/algorithms/list/list-sum-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-sum-2/trace.ts';
test('listSum 正确', () => {
  assert.equal(listSum(buildList([1, 2, 3, 4, 5])), 15);
  assert.equal(listSum(buildList([1])), 1);
  assert.equal(listSum(null), 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
