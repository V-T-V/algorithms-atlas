import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBST, bstMax } from '../../src/algorithms/tree/tree-bst-max-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-bst-max-2/trace.ts';
test('bstMax 正确', () => {
  assert.equal(bstMax(buildBST([50, 30, 70, 60, 80])), 80);
  assert.equal(bstMax(buildBST([5])), 5);
  assert.equal(bstMax(null), null);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
