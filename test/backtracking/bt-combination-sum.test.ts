import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combinationSum } from '../../src/algorithms/backtracking/bt-combination-sum/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-combination-sum/trace.ts';
test('combinationSum 正确', () => {
  assert.deepEqual(combinationSum([2, 3, 6, 7], 7), [[2, 2, 3], [7]]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
