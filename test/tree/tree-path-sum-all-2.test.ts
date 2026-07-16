import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, pathSumAll } from '../../src/algorithms/tree/tree-path-sum-all-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-path-sum-all-2/trace.ts';
test('pathSumAll 正确', () => {
  assert.deepEqual(pathSumAll(buildTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]), 22), [
    [5, 4, 11, 2],
    [5, 8, 4, 5],
  ]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
