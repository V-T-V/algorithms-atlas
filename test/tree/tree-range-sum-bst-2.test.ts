import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBST, rangeSumBST } from '../../src/algorithms/tree/tree-range-sum-bst-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-range-sum-bst-2/trace.ts';
test('rangeSumBST 正确', () => {
  assert.equal(rangeSumBST(buildBST([10, 5, 15, 3, 7, 13, 18, 1, null, 6]), 6, 10), 23);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
