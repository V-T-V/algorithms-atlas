import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, isCompleteTree } from '../../src/algorithms/tree/tree-balance-check-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-balance-check-2/trace.ts';
test('isCompleteTree 正确', () => {
  assert.equal(isCompleteTree(buildTree([1, 2, 3, 4, 5, 6])), true);
  assert.equal(isCompleteTree(buildTree([1, 2, 3, 4, 5, null, 7])), false);
  assert.equal(isCompleteTree(null), true);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
