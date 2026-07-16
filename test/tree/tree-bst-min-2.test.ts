import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBST, bstMin } from '../../src/algorithms/tree/tree-bst-min-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-bst-min-2/trace.ts';
test('bstMin 正确', () => {
  assert.equal(bstMin(buildBST([50, 30, 70, 20, 40])), 20);
  assert.equal(bstMin(buildBST([5])), 5);
  assert.equal(bstMin(null), null);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
