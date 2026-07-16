import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allPaths } from '../../src/algorithms/backtracking/bt-all-paths-graph/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-all-paths-graph/trace.ts';
test('allPaths 正确', () => {
  assert.deepEqual(allPaths([[1, 2], [3], [3], []], 0, 3), [
    [0, 1, 3],
    [0, 2, 3],
  ]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
