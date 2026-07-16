import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, allPaths } from '../../src/algorithms/tree/tree-all-paths-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-all-paths-2/trace.ts';
test('allPaths 正确', () => {
  assert.deepEqual(allPaths(buildTree([1, 2, 3, null, 5])), [
    [1, 2, 5],
    [1, 3],
  ]);
  assert.deepEqual(allPaths(null), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
