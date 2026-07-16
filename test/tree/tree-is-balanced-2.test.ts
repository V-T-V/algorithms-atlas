import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, isBalanced } from '../../src/algorithms/tree/tree-is-balanced-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-is-balanced-2/trace.ts';
test('isBalanced 正确', () => {
  assert.equal(isBalanced(buildTree([3, 9, 20, null, null, 15, 7])), true);
  assert.equal(isBalanced(buildTree([1, 2, 2, 3, 3, null, null, 4, 4])), false);
  assert.equal(isBalanced(null), true);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
