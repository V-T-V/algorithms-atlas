import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, levelOrder } from '../../src/algorithms/tree/tree-levelorder-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-levelorder-2/trace.ts';
test('levelOrder 正确', () => {
  assert.deepEqual(levelOrder(buildTree([3, 9, 20, null, null, 15, 7])), [[3], [9, 20], [15, 7]]);
  assert.deepEqual(levelOrder(null), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
