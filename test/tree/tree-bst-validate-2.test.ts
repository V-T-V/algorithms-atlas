import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, isValidBST } from '../../src/algorithms/tree/tree-bst-validate-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-bst-validate-2/trace.ts';
test('isValidBST 正确', () => {
  assert.equal(isValidBST(buildTree([5, 1, 8, null, null, 6, 9])), true);
  assert.equal(isValidBST(buildTree([5, 1, 4, null, null, 3, 6])), false);
  assert.equal(isValidBST(null), true);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
