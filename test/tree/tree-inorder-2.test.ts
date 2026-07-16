import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, inorder } from '../../src/algorithms/tree/tree-inorder-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-inorder-2/trace.ts';
test('inorder 正确', () => {
  assert.deepEqual(inorder(buildTree([4, 2, 6, 1, 3, 5, 7])), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(inorder(null), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
