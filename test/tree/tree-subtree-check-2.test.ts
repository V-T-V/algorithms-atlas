import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, isSubtree } from '../../src/algorithms/tree/tree-subtree-check-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-subtree-check-2/trace.ts';
test('isSubtree 正确', () => {
  assert.equal(isSubtree(buildTree([3, 4, 5, 1, 2]), buildTree([4, 1, 2])), true);
  assert.equal(
    isSubtree(buildTree([3, 4, 5, 1, 2, null, null, null, null, 0]), buildTree([4, 1, 2])),
    false,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
