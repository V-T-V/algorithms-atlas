import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, countLeaves } from '../../src/algorithms/tree/tree-leaf-count-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-leaf-count-2/trace.ts';
test('countLeaves 正确', () => {
  assert.equal(countLeaves(buildTree([1, 2, 3, 4, 5])), 3);
  assert.equal(countLeaves(buildTree([1])), 1);
  assert.equal(countLeaves(null), 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
