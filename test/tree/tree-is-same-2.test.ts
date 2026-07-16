import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, isSameTree } from '../../src/algorithms/tree/tree-is-same-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-is-same-2/trace.ts';
test('isSameTree 正确', () => {
  assert.equal(isSameTree(buildTree([1, 2, 3]), buildTree([1, 2, 3])), true);
  assert.equal(isSameTree(buildTree([1, 2]), buildTree([1, null, 2])), false);
  assert.equal(isSameTree(null, null), true);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
