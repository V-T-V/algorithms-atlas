import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, minDepth } from '../../src/algorithms/tree/tree-min-depth-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-min-depth-2/trace.ts';
test('minDepth 正确', () => {
  assert.equal(minDepth(buildTree([3, 9, 20, null, null, 15, 7])), 2);
  assert.equal(minDepth(buildTree([1, 2])), 2);
  assert.equal(minDepth(null), 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
