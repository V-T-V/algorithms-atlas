import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combinationSum3 } from '../../src/algorithms/backtracking/bt-combination-sum-3/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-combination-sum-3/trace.ts';
test('combinationSum3 正确', () => {
  assert.deepEqual(combinationSum3(3, 7), [[1, 2, 4]]);
  assert.deepEqual(combinationSum3(3, 9), [
    [1, 2, 6],
    [1, 3, 5],
    [2, 3, 4],
  ]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
