// BST 从前序构造 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-bst-from-preorder',
  categoryId: 'tree',
  title: { zh: '前序遍历构造 BST', en: 'Construct BST from Preorder' },
  summary: {
    zh: '给定 BST 的前序遍历序列，O(n) 重建原 BST。',
    en: 'Reconstruct the BST from its preorder traversal in O(n).',
  },
  description: {
    zh: '从前序遍历构造 BST：前序第一个元素是根。后续元素中，比根小的属于左子树，比根大的属于右子树。\n\n高效方法（带上下界）：build(index, min, max) —— 若 index >= n 返回 null；val = preorder[index]；若 val < min 或 val > max 返回 null；否则创建节点并 index++，node.left = build(index, min, val)，node.right = build(index, val, max)。\n\n用引用传递的 index 跳过已用元素。复杂度 O(n)。',
    en: 'Construct BST from preorder: first element is root; smaller elements form the left subtree, larger the right. Efficient bounded method: build(index, min, max) consumes val only if in (min,max); recurse left with (min,val), right with (val,max), sharing a mutable index. Complexity O(n).',
  },
  tags: ['tree', 'bst', 'construct', 'preorder', 'binary-search-tree'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
