import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, maxDepth } from '../../src/algorithms/tree/tree-max-depth-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-max-depth-2/trace.ts';
test('maxDepth 正确', () => {
  assert.equal(maxDepth(buildTree([3, 9, 20, null, null, 15, 7])), 3);
  assert.equal(maxDepth(buildTree([1])), 1);
  assert.equal(maxDepth(null), 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
