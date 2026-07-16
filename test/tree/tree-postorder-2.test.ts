import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, postorder } from '../../src/algorithms/tree/tree-postorder-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-postorder-2/trace.ts';
test('postorder 正确', () => {
  assert.deepEqual(postorder(buildTree([1, 2, 3, 4, 5, null, 7])), [4, 5, 2, 7, 3, 1]);
  assert.deepEqual(postorder(null), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
