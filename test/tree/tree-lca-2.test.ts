import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, lowestCommonAncestor } from '../../src/algorithms/tree/tree-lca-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-lca-2/trace.ts';
test('lowestCommonAncestor 正确', () => {
  assert.equal(
    lowestCommonAncestor(buildTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]), 5, 1)!.value,
    3,
  );
  assert.equal(
    lowestCommonAncestor(buildTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]), 5, 4)!.value,
    5,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
