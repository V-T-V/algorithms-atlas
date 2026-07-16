import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, leftSideView } from '../../src/algorithms/tree/tree-left-view-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-left-view-2/trace.ts';
test('leftSideView 正确', () => {
  assert.deepEqual(leftSideView(buildTree([1, 2, 3, 4, null, null, 7])), [1, 2, 4]);
  assert.deepEqual(leftSideView(null), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
