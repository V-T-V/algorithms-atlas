import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBST, lowestCommonAncestor } from '../../src/algorithms/tree/tree-bst-lca/impl.ts';

test('两节点分居两侧时 LCA 是根', () => {
  const root = buildBST([50, 30, 70, 20, 40, 60, 80]);
  // 20 在左子树，60 在右子树，LCA 是 50
  assert.equal(lowestCommonAncestor(root, 20, 60)!.value, 50);
});

test('两节点在同一子树', () => {
  const root = buildBST([50, 30, 70, 20, 40, 60, 80]);
  // 20 和 40 都在左子树，LCA 是 30
  assert.equal(lowestCommonAncestor(root, 20, 40)!.value, 30);
  // 60 和 80 的 LCA 是 70
  assert.equal(lowestCommonAncestor(root, 60, 80)!.value, 70);
});

test('一节点是另一节点的祖先', () => {
  const root = buildBST([50, 30, 70, 20, 40]);
  // 30 是 20 的祖先，LCA 是 30
  assert.equal(lowestCommonAncestor(root, 30, 20)!.value, 30);
});

test('p、q 顺序不影响结果', () => {
  const root = buildBST([50, 30, 70, 20, 40]);
  assert.equal(
    lowestCommonAncestor(root, 20, 40)!.value,
    lowestCommonAncestor(root, 40, 20)!.value,
  );
});

test('p、q 为同一节点', () => {
  const root = buildBST([50, 30, 70]);
  assert.equal(lowestCommonAncestor(root, 50, 50)!.value, 50);
});

test('空树', () => {
  assert.equal(lowestCommonAncestor(null, 1, 2), null);
});
