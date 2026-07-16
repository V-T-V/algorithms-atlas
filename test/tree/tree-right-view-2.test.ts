import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, rightSideView } from '../../src/algorithms/tree/tree-right-view-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-right-view-2/trace.ts';
test('rightSideView 正确', () => {
  assert.deepEqual(rightSideView(buildTree([1, 2, 3, null, 5, null, 4])), [1, 3, 4]);
  assert.deepEqual(rightSideView(null), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
