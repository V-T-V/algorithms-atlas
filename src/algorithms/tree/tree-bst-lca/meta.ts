// BST 最近公共祖先 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-bst-lca',
  categoryId: 'tree',
  title: { zh: 'BST 最近公共祖先', en: 'BST Lowest Common Ancestor' },
  summary: {
    zh: '利用 BST 性质，O(log n) 找两个节点的最近公共祖先。',
    en: 'Use the BST property to find the lowest common ancestor of two nodes in O(log n).',
  },
  description: {
    zh: 'BST 的 LCA：从根开始：\n- 若 p、q 都小于 node.value：LCA 在左子树，node = node.left\n- 若 p、q 都大于 node.value：LCA 在右子树，node = node.right\n- 否则（p、q 分居两侧，或其一等于 node）：当前 node 即为 LCA\n\nBST 的有序性让 LCA 只需沿一条路径下降。复杂度 O(log n)。',
    en: 'BST LCA: from root, if both p,q smaller than node.value go left; if both larger go right; otherwise the current node is the LCA (split point or equal). The ordering makes LCA a single descent. Complexity O(log n).',
  },
  tags: ['tree', 'bst', 'lca', 'ancestor', 'binary-search-tree'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
