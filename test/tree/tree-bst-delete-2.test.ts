import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBST, bstDelete } from '../../src/algorithms/tree/tree-bst-delete-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-bst-delete-2/trace.ts';
const inorder = (r: any): number[] =>
  !r ? [] : [...inorder(r.left), r.value, ...inorder(r.right)];
test('bstDelete 正确', () => {
  assert.deepEqual(inorder(bstDelete(buildBST([5, 3, 6, 2, 4, 7]), 3)), [2, 4, 5, 6, 7]);
  assert.deepEqual(inorder(bstDelete(buildBST([5, 3, 6, 2, 4, 7]), 5)), [2, 3, 4, 6, 7]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
