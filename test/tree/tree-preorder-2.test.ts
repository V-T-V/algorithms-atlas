import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, preorder } from '../../src/algorithms/tree/tree-preorder-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-preorder-2/trace.ts';
test('preorder 正确', () => {
  assert.deepEqual(preorder(buildTree([1, 2, 3, 4, 5, null, 7])), [1, 2, 4, 5, 3, 7]);
  assert.deepEqual(preorder(null), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
