import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBST, kthSmallest } from '../../src/algorithms/tree/tree-kth-smallest-bst-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-kth-smallest-bst-2/trace.ts';
test('kthSmallest 正确', () => {
  assert.equal(kthSmallest(buildBST([5, 3, 6, 2, 4, null, null, 1]), 3), 3);
  assert.equal(kthSmallest(buildBST([5, 3, 6, 2, 4, null, null, 1]), 1), 1);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
