import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, countNodes } from '../../src/algorithms/tree/tree-count-nodes-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-count-nodes-2/trace.ts';
test('countNodes 正确', () => {
  assert.equal(countNodes(buildTree([1, 2, 3, 4, 5, 6])), 6);
  assert.equal(countNodes(buildTree([1])), 1);
  assert.equal(countNodes(null), 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
