import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBST, insertTracked } from '../../src/algorithms/tree/tree-bst-insert-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-bst-insert-2/trace.ts';
const inorder = (r: any): number[] =>
  !r ? [] : [...inorder(r.left), r.value, ...inorder(r.right)];
test('bstInsert 正确', () => {
  const r = insertTracked(buildBST([50, 30, 70]), 40);
  assert.deepEqual(inorder(r), [30, 40, 50, 70]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
