import { test } from 'node:test';
import assert from 'node:assert/strict';
import { subsetsOfSizeK } from '../../src/algorithms/backtracking/bt-subsets-size-k/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-subsets-size-k/trace.ts';
test('subsetsOfSizeK 正确', () => {
  assert.equal(subsetsOfSizeK(4, 2).length, 6);
  assert.equal(subsetsOfSizeK(5, 0).length, 1);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
