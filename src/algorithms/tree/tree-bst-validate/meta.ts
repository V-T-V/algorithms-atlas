// BST 合法性验证 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-bst-validate',
  categoryId: 'tree',
  title: { zh: 'BST 合法性验证', en: 'Validate Binary Search Tree' },
  summary: {
    zh: '用上下界约束递归验证一棵二叉树是否满足 BST 性质。',
    en: 'Recursively verify a binary tree satisfies the BST property using min/max bounds.',
  },
  description: {
    zh: 'BST 验证：每个节点的值必须在 (min, max) 开区间内。\n\n递归：validate(node, min=-∞, max=+∞) —— 若 node 为 null 返回 true；若 node.value <= min 或 node.value >= max 返回 false；否则返回 validate(node.left, min, node.value) and validate(node.right, node.value, max)。\n\n左子树所有值必须 < 当前；右子树所有值必须 > 当前。复杂度 O(n)。',
    en: 'BST validation: each node value must be in the open interval (min, max). Recurse: validate(node, min, max) — null → true; node.value not in (min,max) → false; else validate(left, min, node.value) AND validate(right, node.value, max). Left subtree < node, right subtree > node. Complexity O(n).',
  },
  tags: ['tree', 'bst', 'validate', 'binary-search-tree'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
