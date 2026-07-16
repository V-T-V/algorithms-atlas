import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBST, bstSearch } from '../../src/algorithms/tree/tree-bst-search-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-bst-search-2/trace.ts';
test('bstSearch 正确', () => {
  const root = buildBST([50, 30, 70, 20, 40, 60, 80]);
  assert.equal(bstSearch(root, 60), true);
  assert.equal(bstSearch(root, 25), false);
  assert.equal(bstSearch(null, 1), false);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
