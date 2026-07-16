import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, maxPathSum } from '../../src/algorithms/tree/tree-max-path-sum-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-max-path-sum-2/trace.ts';
test('maxPathSum 正确', () => {
  assert.equal(maxPathSum(buildTree([-10, 9, 20, null, null, 15, 7])), 42);
  assert.equal(maxPathSum(buildTree([1, 2, 3])), 6);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
