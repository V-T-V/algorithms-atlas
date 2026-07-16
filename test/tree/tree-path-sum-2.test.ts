import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, hasPathSum } from '../../src/algorithms/tree/tree-path-sum-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-path-sum-2/trace.ts';
test('hasPathSum 正确', () => {
  assert.equal(
    hasPathSum(buildTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]), 22),
    true,
  );
  assert.equal(hasPathSum(buildTree([1, 2, 3]), 5), false);
  assert.equal(hasPathSum(null, 0), false);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
